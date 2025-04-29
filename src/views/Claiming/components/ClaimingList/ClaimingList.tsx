import difference from 'lodash/difference';
import React, {
  memo,
  useCallback,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';
import {
  matchPath,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import { MultiColumnList } from '@folio/stripes/components';
import {
  PrevNextPagination,
  useItemToView,
} from '@folio/stripes-acq-components';

import {
  CLAIMING_LIST_COLUMNS,
  CLAIMING_LIST_SORTABLE_FIELDS,
} from '../../constants';
import { getResultsListFormatter } from '../../utils';

import type {
  ClaimingListColumn,
  ClaimingListColumnMapping,
} from '../../types';

import css from './ClaimingList.css';

type Claim = ACQ.Claim;

const nonInteractiveHeaders = difference(
  Object.values(CLAIMING_LIST_COLUMNS),
  Object.values(CLAIMING_LIST_SORTABLE_FIELDS),
);

interface Props {
  columnMapping: ClaimingListColumnMapping;
  contentData: Claim[];
  isEmptyMessage: React.ReactNode;
  isLoading: boolean;
  height: number;
  onHeaderClick: () => void;
  onNeedMoreData: () => void;
  onSelect: (item: Claim) => void;
  pagination: ACQ.Pagination;
  selectedRecordsDict: Record<string, ACQ.Claim>;
  sortDirection?: ACQ.SortingOrder;
  sortingField?: keyof Claim;
  totalCount: number;
  visibleColumns: ClaimingListColumn[];
  width: number;
}

const ClaimingList: React.FC<Props> = ({
  columnMapping,
  contentData,
  height,
  isEmptyMessage,
  isLoading,
  onHeaderClick,
  onNeedMoreData,
  onSelect,
  pagination,
  selectedRecordsDict,
  sortDirection,
  sortingField,
  totalCount,
  visibleColumns,
  width,
}) => {
  const intl = useIntl();
  const location = useLocation();
  const match = useRouteMatch();

  const { itemToView, setItemToView, deleteItemToView } = useItemToView('claiming-list');

  const urlParams = useMemo(() => (
    matchPath<{ id?: string }>(location.pathname, { path: `${match.path}/:id/view` })
  ), [location.pathname, match.path]);

  const isRowSelected = useCallback(({ item }: { item: Claim }) => {
    return urlParams ? (urlParams.params.id === item.id) : false;
  }, [urlParams]);

  const formatter = useMemo(() => {
    return getResultsListFormatter({
      disabled: isLoading,
      intl,
      onSelect,
      selectedRecordsDict,
    });
  }, [isLoading, intl, onSelect, selectedRecordsDict]);

  return (
    <>
      <MultiColumnList
        id="claiming-list"
        contentData={contentData}
        totalCount={totalCount}
        visibleColumns={visibleColumns as (keyof Claim)[]}
        columnMapping={columnMapping as unknown as Record<keyof Claim, React.ReactNode>}
        formatter={formatter as Record<keyof Claim, (item: Claim) => React.ReactNode>}
        getCellClass={(defaultCellStyle) => `${defaultCellStyle} ${css.cellAlign}`}
        loading={isLoading}
        onNeedMoreData={onNeedMoreData}
        sortedColumn={sortingField}
        sortDirection={sortDirection}
        onHeaderClick={onHeaderClick}
        isEmptyMessage={isEmptyMessage}
        hasMargin
        height={height - PrevNextPagination.HEIGHT}
        width={width}
        isSelected={isRowSelected}
        itemToView={itemToView}
        onMarkPosition={setItemToView}
        onMarkReset={deleteItemToView}
        pagingType={'none' as 'click'}
        stickyFirstColumn
        columnWidths={{ [CLAIMING_LIST_COLUMNS.select as keyof Claim]: '34px' }}
        nonInteractiveHeaders={nonInteractiveHeaders as (keyof Claim)[]}
      />

      {contentData.length > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={totalCount}
          disabled={isLoading}
          onChange={onNeedMoreData}
        />
      )}
    </>
  );
};

export default memo(ClaimingList);

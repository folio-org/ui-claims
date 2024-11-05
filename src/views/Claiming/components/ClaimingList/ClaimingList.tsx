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

import { getResultsListFormatter } from '../../utils';

import type {
  ClaimingListColumn,
  ClaimingListColumnMapping,
} from '../../types';

interface Props {
  columnMapping: ClaimingListColumnMapping;
  contentData: ACQ.Claim[];
  isEmptyMessage: React.ReactNode;
  isLoading: boolean;
  height: number;
  onHeaderClick: () => void;
  onNeedMoreData: () => void;
  onSelect: (item: ACQ.Claim) => void;
  pagination: Pagination;
  sortDirection?: SortingOrder;
  sortingField?: keyof ACQ.Claim;
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

  const isRowSelected = useCallback(({ item }: { item: ACQ.Claim }) => {
    return urlParams ? (urlParams.params.id === item.id) : false;
  }, [urlParams]);

  const formatter = useMemo(() => getResultsListFormatter({ intl, onSelect }), [intl, onSelect]);

  return (
    <>
      <MultiColumnList
        id="claiming-list"
        contentData={contentData}
        totalCount={totalCount}
        visibleColumns={visibleColumns as (keyof ACQ.Claim)[]}
        columnMapping={columnMapping as unknown as Record<keyof ACQ.Claim, React.ReactNode>}
        formatter={formatter as Record<keyof ACQ.Claim, (item: ACQ.Claim) => React.ReactNode>}
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

import React, {
  memo,
  useCallback,
  useMemo,
} from 'react';
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

import { CLAIMING_LIST_COLUMN_MAPPING } from '../../constants';
import { getResultsListFormatter } from './getResultsListFormatter';

interface Props {
  contentData: ACQ.Claim[];
  isEmptyMessage: React.ReactNode;
  isLoading: boolean;
  height: number;
  onHeaderClick: () => void;
  onNeedMoreData: () => void;
  pagination: Pagination;
  sortDirection?: 'ascending' | 'descending';
  sortingField?: keyof ACQ.Claim;
  totalCount: number;
  visibleColumns: (keyof ACQ.Claim)[];
  width: number;
}

const ClaimingList: React.FC<Props> = ({
  contentData,
  height,
  isEmptyMessage,
  isLoading,
  onHeaderClick,
  onNeedMoreData,
  pagination,
  sortDirection,
  sortingField,
  totalCount,
  visibleColumns,
  width,
}) => {
  const location = useLocation();
  const match = useRouteMatch();

  const { itemToView, setItemToView, deleteItemToView } = useItemToView('claiming-list');

  const urlParams = useMemo(() => (
    matchPath<{ id?: string }>(location.pathname, { path: `${match.path}/:id/view` })
  ), [location.pathname, match.path]);

  const isRowSelected = useCallback(({ item }: { item: ACQ.Claim }) => {
    return urlParams ? (urlParams.params.id === item.id) : false;
  }, [urlParams]);

  const formatter = useMemo(() => getResultsListFormatter(), []);

  return (
    <>
      <MultiColumnList
        id="claiming-list"
        contentData={contentData}
        totalCount={totalCount}
        visibleColumns={visibleColumns}
        columnMapping={CLAIMING_LIST_COLUMN_MAPPING}
        formatter={formatter}
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

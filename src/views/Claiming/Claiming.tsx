import noop from 'lodash/noop';
import React, {
  useCallback,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import {
  TitleManager,
  useNamespace,
} from '@folio/stripes/core';
import {
  ColumnManagerMenu,
  PersistedPaneset,
  useColumnManager,
} from '@folio/stripes/smart-components';
import {
  FiltersPane,
  NoResultsMessage,
  ResetButton,
  RESULT_COUNT_INCREMENT,
  ResultsPane,
  SEARCH_PARAMETER,
  SingleSearchForm,
  useFiltersReset,
  useFiltersToogle,
  useLocationFilters,
  useLocationSorting,
  usePagination,
} from '@folio/stripes-acq-components';

import {
  ClaimingList,
  ClaimingListFilters,
} from './components';
import {
  CLAIMING_LIST_COLUMNS,
  CLAIMING_LIST_SORTABLE_FIELDS,
} from './constants';
import { useClaiming } from './hooks';
import { CLAIMING_SEARCHABLE_INDICES } from './search';
import { getResultsListColumnMapping } from './utils';

import type { ClaimingListColumn } from './types';

const resetData = noop;

const SEARCH_INDICES = [
  {
    labelId: 'ui-claims.search.index.keyword',
    value: '',
  },
  ...CLAIMING_SEARCHABLE_INDICES.map(index => ({ labelId: `ui-claims.search.index.${index}`, value: index })),
];

export const Claiming: React.FC = () => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const [namespace] = useNamespace({ key: 'filters' });
  const { isFiltersOpened, toggleFilters } = useFiltersToogle(namespace);

  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    changeIndex,
    searchIndex,
  ] = useLocationFilters(location, history, resetData);

  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData, CLAIMING_LIST_SORTABLE_FIELDS);

  const { pagination, changePage } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });

  const {
    claims,
    isFetching,
    totalRecords,
  } = useClaiming({
    filters,
    pagination,
    sorting: { sorting: sortingField, sortingDirection },
  });

  useFiltersReset(resetFilters);

  const selectAll = useCallback(() => {
    console.log('all selected');
  }, []);

  const selectOne = useCallback(() => {
    console.log('one selected');
  }, []);

  const columnMapping = useMemo(() => {
    return getResultsListColumnMapping({
      intl,
      selectAll,
      disabled: isFetching,
    });
  }, [intl, isFetching, selectAll]);

  const {
    toggleColumn,
    visibleColumns,
  } = useColumnManager('claiming-list', columnMapping);

  const queryFilter = filters?.[SEARCH_PARAMETER];
  const pageTitle = queryFilter ? intl.formatMessage({ id: 'ui-claims.document.title.search' }, { query: queryFilter }) : null;

  const renderActionMenu = ({ onToggle }: { onToggle: (key: string) => void }) => {
    return (
      <ColumnManagerMenu
        prefix="claiming"
        columnMapping={columnMapping}
        visibleColumns={visibleColumns}
        toggleColumn={toggleColumn}
        excludeColumns={[CLAIMING_LIST_COLUMNS.select]}
      />
    );
  };

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isFetching}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  return (
    <div>
      <TitleManager page={pageTitle} />
      <PersistedPaneset
        appId="ui-claims"
        id="claiming-paneset"
      >
        {isFiltersOpened && (
          <FiltersPane
            id="claiming-filters-pane"
            toggleFilters={toggleFilters}
          >
            <SingleSearchForm
              applySearch={applySearch}
              changeSearch={changeSearch}
              searchQuery={searchQuery}
              isLoading={isFetching}
              ariaLabelId="ui-claims.titles.search"
              searchableIndexes={SEARCH_INDICES}
              changeSearchIndex={changeIndex}
              selectedIndex={searchIndex}
            />

            <ResetButton
              id="reset-receiving-filters"
              reset={resetFilters}
              disabled={!location.search || isFetching}
            />

            <ClaimingListFilters
              activeFilters={filters}
              applyFilters={applyFilters}
              disabled={isFetching}
            />
          </FiltersPane>
        )}

        <ResultsPane
          id="claiming-results-pane"
          autosize
          title={intl.formatMessage({ id: 'ui-claims.claiming.results.title' })}
          renderActionMenu={renderActionMenu}
          count={totalRecords}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
          isLoading={isFetching}
        >
          {(({ height, width }: Dimensions) => (
            <ClaimingList
              columnMapping={columnMapping}
              contentData={claims}
              height={height}
              isEmptyMessage={resultsStatusMessage}
              isLoading={isFetching}
              onHeaderClick={changeSorting}
              onNeedMoreData={changePage}
              onSelect={selectOne}
              pagination={pagination}
              sortDirection={sortingDirection}
              sortingField={sortingField}
              totalCount={totalRecords}
              visibleColumns={visibleColumns as ClaimingListColumn[]}
              width={width}
            />
          ))}
        </ResultsPane>
      </PersistedPaneset>
    </div>
  );
};

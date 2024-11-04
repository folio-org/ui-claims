import noop from 'lodash/noop';
import React from 'react';
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

import { useClaims } from '../../hooks';
import {
  ClaimingList,
  ClaimingListFilters,
} from './components';
import {
  CLAIMING_LIST_COLUMN_MAPPING,
  CLAIMING_LIST_SORTABLE_FIELDS,
} from './constants';
import { CLAIMING_SEARCHABLE_INDICES } from './search';

const resetData = noop;

const SEARCH_INDICES = [
  {
    labelId: 'ui-claims.search.index.keyword',
    value: '',
  },
  ...CLAIMING_SEARCHABLE_INDICES.map(index => ({ labelId: `ui-claims.search.index.${index}`, value: index })),
];

export const Claiming = (): React.JSX.Element => {
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

  useFiltersReset(resetFilters);

  const {
    toggleColumn,
    visibleColumns,
  } = useColumnManager('claiming-list', CLAIMING_LIST_COLUMN_MAPPING);

  const queryFilter = filters?.[SEARCH_PARAMETER];
  const pageTitle = queryFilter ? intl.formatMessage({ id: 'ui-claims.document.title.search' }, { query: queryFilter }) : null;

  const {
    claims,
    isLoading,
    totalRecords,
  } = useClaims();

  const renderActionMenu = ({ onToggle }: { onToggle: (key: string) => void }) => {
    return (
      <ColumnManagerMenu
        prefix="orders"
        columnMapping={CLAIMING_LIST_COLUMN_MAPPING}
        visibleColumns={visibleColumns}
        toggleColumn={toggleColumn}
      />
    );
  };

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
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
              isLoading={isLoading}
              ariaLabelId="ui-claims.titles.search"
              searchableIndexes={SEARCH_INDICES}
              changeSearchIndex={changeIndex}
              selectedIndex={searchIndex}
            />

            <ResetButton
              id="reset-receiving-filters"
              reset={resetFilters}
              disabled={!location.search || isLoading}
            />

            <ClaimingListFilters
              activeFilters={filters}
              applyFilters={applyFilters}
              disabled={isLoading}
            />
          </FiltersPane>
        )}

        <ResultsPane
          id="claiming-results-pane"
          autosize
          title={intl.formatMessage({ id: 'ui-claims.claimingList.title' })}
          renderActionMenu={renderActionMenu}
          count={totalRecords}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
          isLoading={isLoading}
        >
          {(({ height, width }: Dimensions) => (
            <ClaimingList
              contentData={claims}
              height={height}
              isEmptyMessage={resultsStatusMessage}
              isLoading={isLoading}
              onHeaderClick={changeSorting}
              onNeedMoreData={changePage}
              pagination={pagination}
              sortDirection={sortingDirection}
              sortingField={sortingField}
              totalCount={totalRecords}
              visibleColumns={visibleColumns as (keyof ACQ.Claim)[]}
              width={width}
            />
          ))}
        </ResultsPane>
      </PersistedPaneset>
    </div>
  );
};

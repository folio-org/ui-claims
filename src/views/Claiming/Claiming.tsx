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

import { MenuSection } from '@folio/stripes/components';
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
  DelayClaimActionMenuItem,
  SendClaimActionMenuItem,
  FiltersPane,
  getFiltersCount,
  MarkUnreceivableActionMenuItem,
  NoResultsMessage,
  PIECE_STATUS,
  ResetButton,
  RESULT_COUNT_INCREMENT,
  ResultsPane,
  SEARCH_PARAMETER,
  SingleSearchForm,
  useClaimsSend,
  useFiltersReset,
  useFiltersToogle,
  useLocationFilters,
  useLocationSorting,
  useModalToggle,
  usePagination,
  useRecordsSelect,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  ClaimingList,
  ClaimingListFilters,
} from './components';
import {
  DelayClaimModal,
  SendClaimModal,
} from './components/modals';
import {
  CLAIMING_LIST_COLUMNS,
  CLAIMING_LIST_SORTABLE_FIELDS,
  FILTERS,
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

const FILTERS_OPTIONS = {};

const DEFAULT_FILTERS = {
  [FILTERS.POL_CLAIMING_ACTIVE]: ['true'],
  [FILTERS.RECEIVING_STATUS]: [PIECE_STATUS.late],
};

export const Claiming: React.FC = () => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const [namespace] = useNamespace({ key: 'filters' });
  const showCallout = useShowCallout();
  const { isFiltersOpened, toggleFilters } = useFiltersToogle(namespace);
  const [isClaimDelayModalOpen, toggleClaimDelayModal] = useModalToggle();
  const [isClaimSendModalOpen, toggleClaimSendModal] = useModalToggle();

  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    changeIndex,
    searchIndex,
  ] = useLocationFilters(location, history, resetData, FILTERS_OPTIONS, DEFAULT_FILTERS);

  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData, CLAIMING_LIST_SORTABLE_FIELDS);

  const { pagination, changePage } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });

  const {
    isLoading: isSendClaimLoading,
    sendClaims,
  } = useClaimsSend();

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

  const {
    allRecordsSelected,
    selectedRecordsMap,
    selectedRecordsLength,
    toggleSelectAll,
    selectRecord,
  } = useRecordsSelect({ records: claims });

  const columnMapping = useMemo(() => {
    return getResultsListColumnMapping({
      disabled: isFetching,
      intl,
      isAllSelected: allRecordsSelected,
      selectAll: toggleSelectAll,
    });
  }, [allRecordsSelected, intl, isFetching, toggleSelectAll]);

  const {
    toggleColumn,
    visibleColumns,
  } = useColumnManager('claiming-list', columnMapping);

  const queryFilter = filters?.[SEARCH_PARAMETER];
  const pageTitle = queryFilter ? intl.formatMessage({ id: 'ui-claims.document.title.search' }, { query: queryFilter }) : null;

  const renderActionMenu = ({ onToggle }: { onToggle: (e?: Event) => void }) => {
    return (
      <>
        <MenuSection>
          <SendClaimActionMenuItem
            disabled={!selectedRecordsLength}
            onClick={(e) => {
              onToggle(e);
              toggleClaimSendModal();
            }}
          />

          <DelayClaimActionMenuItem
            disabled={!selectedRecordsLength}
            onClick={(e) => {
              onToggle(e);
              toggleClaimDelayModal();
            }}
          />

          <MarkUnreceivableActionMenuItem
            disabled={!selectedRecordsLength}
            onClick={(e) => {
              onToggle(e);
            }}
          />
        </MenuSection>

        <ColumnManagerMenu
          prefix="claiming"
          columnMapping={columnMapping}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
          excludeColumns={[CLAIMING_LIST_COLUMNS.select]}
        />
      </>
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

  const onClaimsDelay = useCallback(() => {
    console.log('delay claim'); // TODO: https://folio-org.atlassian.net/browse/UICLAIM-4
  }, []);

  const onClaimsSend = useCallback(async () => {
    try {
      const { claimingPieceResults } = await sendClaims({
        data: { claimingPieceIds: Object.keys(selectedRecordsMap) },
      });

      // handleClaimingPieceResults(claimingPieceResults);

      showCallout({ messageId: 'ui-claims.claiming.sendClaim.success.message' });
      toggleClaimSendModal();
    } catch {
      showCallout({
        messageId: 'ui-claims.claiming.sendClaim.failure.message',
        type: 'error',
      });
    }
  }, [
    selectedRecordsMap,
    sendClaims,
    showCallout,
    toggleClaimSendModal,
  ]);

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
              disabled={!getFiltersCount(filters) || isFetching}
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
          {(({ height, width }: ACQ.Dimensions) => (
            <ClaimingList
              columnMapping={columnMapping}
              contentData={claims}
              height={height}
              isEmptyMessage={resultsStatusMessage}
              isLoading={isFetching}
              onHeaderClick={changeSorting}
              onNeedMoreData={changePage}
              onSelect={selectRecord}
              pagination={pagination}
              selectedRecordsDict={selectedRecordsMap}
              sortDirection={sortingDirection}
              sortingField={sortingField}
              totalCount={totalRecords}
              visibleColumns={visibleColumns as ClaimingListColumn[]}
              width={width}
            />
          ))}
        </ResultsPane>
      </PersistedPaneset>

      <DelayClaimModal
        disabled
        open={isClaimDelayModalOpen}
        onCancel={toggleClaimDelayModal}
        onSubmit={onClaimsDelay}
      />

      <SendClaimModal
        disabled={isSendClaimLoading}
        open={isClaimSendModalOpen}
        onCancel={toggleClaimSendModal}
        onSubmit={onClaimsSend}
        selectedRecordsCount={selectedRecordsLength}
      />
    </div>
  );
};

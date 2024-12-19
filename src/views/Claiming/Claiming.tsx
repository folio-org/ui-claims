import noop from 'lodash/noop';
import React, {
  useCallback,
  useMemo,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
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
  DelayClaimsModal,
  FiltersPane,
  getClaimingIntervalFromDate,
  getFiltersCount,
  MarkUnreceivableActionMenuItem,
  NoResultsMessage,
  PIECE_STATUS,
  ResetButton,
  RESULT_COUNT_INCREMENT,
  ResultsPane,
  SEARCH_PARAMETER,
  SendClaimActionMenuItem,
  SendClaimsModal,
  SingleSearchForm,
  useClaimsDelay,
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
  CLAIMING_LIST_COLUMNS,
  CLAIMING_LIST_SORTABLE_FIELDS,
  FILTERS,
} from './constants';
import { useClaiming } from './hooks';
import { CLAIMING_SEARCHABLE_INDICES } from './search';
import {
  getResultsListColumnMapping,
  handleClaimingPieceErrorResults,
} from './utils';

import type { ClaimingListColumn } from './types';

interface DelayClaimsFormValues {
  claimingDate: string;
}

interface SendClaimsFormValues {
  claimingDate: string;
  externalNote: string;
  internalNote: string;
}

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
    delayClaims,
    isLoading: isDelayClaimsLoading,
  } = useClaimsDelay();

  const {
    claims,
    isFetching,
    refetch,
    totalRecords,
  } = useClaiming({
    filters,
    pagination,
    sorting: { sorting: sortingField, sortingDirection },
  });

  useFiltersReset(resetFilters);

  const {
    allRecordsSelected,
    resetAllSelectedRecords,
    resetOtherSelectedRecordsByIds,
    selectedRecordsLength,
    selectedRecordsMap,
    selectRecord,
    toggleSelectAll,
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
            disabled={!selectedRecordsLength || true /* TODO: UICLAIM-5 */}
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

  const onClaimsDelay = useCallback(async ({ claimingDate }: DelayClaimsFormValues) => {
    // TODO: https://folio-org.atlassian.net/browse/UICLAIM-4
    try {
      await delayClaims({
        claimingInterval: getClaimingIntervalFromDate(claimingDate),
        pieceIds: Object.keys(selectedRecordsMap),
      });

      resetAllSelectedRecords();
      refetch();
      toggleClaimDelayModal();
      showCallout({ messageId: 'ui-claims.claiming.delayClaim.success.message' });
    } catch {
      showCallout({
        messageId: 'ui-claims.claiming.delayClaim.error.message',
        type: 'error',
      });
    }
  }, [
    delayClaims,
    refetch,
    resetAllSelectedRecords,
    selectedRecordsMap,
    showCallout,
    toggleClaimDelayModal,
  ]);

  const onClaimsSend = useCallback(async ({
    claimingDate,
    externalNote,
    internalNote,
  }: SendClaimsFormValues) => {
    try {
      const { claimingPieceResults } = await sendClaims({
        data: {
          claimingInterval: getClaimingIntervalFromDate(claimingDate),
          claimingPieceIds: Object.keys(selectedRecordsMap),
          externalNote,
          internalNote,
        },
      });

      const errorResults = claimingPieceResults.filter((val) => 'error' in val);

      if (errorResults.length) {
        handleClaimingPieceErrorResults(errorResults, showCallout);
      } else {
        resetAllSelectedRecords();
        showCallout({ messageId: 'ui-claims.claiming.sendClaim.success.message' });
      }

      resetOtherSelectedRecordsByIds([Object.keys(selectedRecordsMap)[0]]);

      refetch();
      toggleClaimSendModal();
    } catch {
      showCallout({
        messageId: 'ui-claims.claiming.sendClaim.error.message',
        type: 'error',
      });
    }
  }, [
    refetch,
    resetAllSelectedRecords,
    resetOtherSelectedRecordsByIds,
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

      <DelayClaimsModal
        claimsCount={selectedRecordsLength}
        disabled={isDelayClaimsLoading}
        open={isClaimDelayModalOpen}
        onCancel={toggleClaimDelayModal}
        onSubmit={onClaimsDelay}
      />

      <SendClaimsModal
        claimsCount={selectedRecordsLength}
        disabled={isSendClaimLoading}
        message={(
          <FormattedMessage
            id="ui-claims.claiming.sendClaim.modal.message"
            values={{ count: selectedRecordsLength }}
          />
        )}
        open={isClaimSendModalOpen}
        onCancel={toggleClaimSendModal}
        onSubmit={onClaimsSend}
      />
    </div>
  );
};

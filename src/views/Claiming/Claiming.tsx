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
  usePiecesStatusBatchUpdate,
  useRecordsSelect,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  ClaimingList,
  ClaimingListFilters,
  MarkUnreceivableModal,
  GroupByOrgActionMenuItem,
} from './components';
import {
  CLAIMING_LIST_COLUMNS,
  CLAIMING_HIDDEN_LIST_COLUMNS,
  CLAIMING_LIST_SORTABLE_FIELDS,
  FILTERS,
  RESPONSE_ERROR_CODE,
} from './constants';
import {
  useClaimErrorsHandler,
  useClaiming,
} from './hooks';
import { CLAIMING_SEARCHABLE_INDICES } from './search';
import { getResultsListColumnMapping } from './utils';

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
  const [isMarkUnreceivableModalOpen, toggleMarkUnreceivableModalOpen] = useModalToggle();

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
    isLoading: isPiecesStatusUpdateLoading,
    updatePiecesStatus,
  } = usePiecesStatusBatchUpdate();

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

  const { handlerErrorResponse } = useClaimErrorsHandler();

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
  const sortByOrg = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (sortingField !== CLAIMING_HIDDEN_LIST_COLUMNS.vendorId) {
      changeSorting(e, { name: CLAIMING_HIDDEN_LIST_COLUMNS.vendorId });
    }
  };

  const renderActionMenu = ({ onToggle }: { onToggle: (e?: Event) => void }) => {
    return (
      <>
        <MenuSection>
          <GroupByOrgActionMenuItem
            onClick={(e) => {
              onToggle(e as unknown as Event | undefined);
              sortByOrg(e);
            }}
          />

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
              toggleMarkUnreceivableModalOpen();
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

  const onClaimsSend = useCallback(async ({
    claimingDate,
    externalNote,
    internalNote,
  }: SendClaimsFormValues) => {
    try {
      await sendClaims({
        data: {
          claimingInterval: getClaimingIntervalFromDate(claimingDate),
          claimingPieceIds: Object.keys(selectedRecordsMap),
          externalNote,
          internalNote,
        },
      });

      resetAllSelectedRecords();
      showCallout({ messageId: 'ui-claims.claiming.sendClaim.success.message' });
    } catch (errors) {
      await handlerErrorResponse(
        errors.response as Response,
        {
          callbacksDict: {
            [RESPONSE_ERROR_CODE.unableToGenerateClaimsForOrgNoIntegrationDetails]: ({ pieceIds }) => {
              resetOtherSelectedRecordsByIds(pieceIds);
            },
            [RESPONSE_ERROR_CODE.cannotFindPiecesWithLatestStatusToProcess]: ({ pieceIds }) => {
              resetOtherSelectedRecordsByIds(pieceIds);
            },
          },
          defaultMessageId: 'ui-claims.claiming.sendClaim.error.message',
        },
      );
    }

    refetch();
    toggleClaimSendModal();
  }, [
    handlerErrorResponse,
    refetch,
    resetAllSelectedRecords,
    resetOtherSelectedRecordsByIds,
    selectedRecordsMap,
    sendClaims,
    showCallout,
    toggleClaimSendModal,
  ]);

  const onClaimsDelay = useCallback(async ({ claimingDate }: DelayClaimsFormValues) => {
    try {
      await delayClaims({
        claimingInterval: getClaimingIntervalFromDate(claimingDate),
        pieceIds: Object.keys(selectedRecordsMap),
      });

      resetAllSelectedRecords();
      showCallout({ messageId: 'ui-claims.claiming.delayClaim.success.message' });
    } catch (errors) {
      await handlerErrorResponse(
        errors.response as Response,
        { defaultMessageId: 'ui-claims.claiming.delayClaim.error.message' },
      );
    }

    refetch();
    toggleClaimDelayModal();
  }, [
    delayClaims,
    handlerErrorResponse,
    refetch,
    resetAllSelectedRecords,
    selectedRecordsMap,
    showCallout,
    toggleClaimDelayModal,
  ]);

  const onMarkUnreceivable = useCallback(async () => {
    try {
      await updatePiecesStatus({
        data: {
          pieceIds: Object.keys(selectedRecordsMap),
          receivingStatus: PIECE_STATUS.unreceivable,
        },
      });

      resetAllSelectedRecords();
      showCallout({ messageId: 'ui-claims.claiming.markUnreceivable.success.message' });
    } catch (errors) {
      await handlerErrorResponse(
        errors.response as Response,
        { defaultMessageId: 'ui-claims.claiming.markUnreceivable.error.message' },
      );
    }

    refetch();
    toggleMarkUnreceivableModalOpen();
  }, [
    handlerErrorResponse,
    refetch,
    resetAllSelectedRecords,
    selectedRecordsMap,
    showCallout,
    toggleMarkUnreceivableModalOpen,
    updatePiecesStatus,
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

      <MarkUnreceivableModal
        claimsCount={selectedRecordsLength}
        disabled={isPiecesStatusUpdateLoading}
        open={isMarkUnreceivableModalOpen}
        onCancel={toggleMarkUnreceivableModalOpen}
        onSubmit={onMarkUnreceivable}
      />
    </div>
  );
};

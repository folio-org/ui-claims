import React from 'react';

import { NoValue } from '@folio/stripes/components';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

import { CLAIMING_LIST_COLUMNS } from '../../constants';

import type { ClaimingListColumn } from '../../types';

type Formatter = Record<ClaimingListColumn, (item: ACQ.Claim) => React.ReactNode>;

export const getResultsListFormatter = (): Formatter => {
  const formatter: Formatter = {
    [CLAIMING_LIST_COLUMNS.chronology]: ({ chronology }) => (chronology || <NoValue />),
    [CLAIMING_LIST_COLUMNS.displaySummary]: ({ displaySummary }) => displaySummary || <NoValue />,
    [CLAIMING_LIST_COLUMNS.enumeration]: ({ enumeration }) => enumeration || <NoValue />,
    [CLAIMING_LIST_COLUMNS.piecesToClaim]: ({ piecesToClaim }) => piecesToClaim || <NoValue />,
    [CLAIMING_LIST_COLUMNS.poLineNumber]: ({ poLineNumber }) => poLineNumber || <NoValue />,
    [CLAIMING_LIST_COLUMNS.receiptDate]: ({ receiptDate }) => <FolioFormattedDate value={receiptDate} />,
    [CLAIMING_LIST_COLUMNS.receivingStatus]: ({ receivingStatus }) => receivingStatus || <NoValue />,
    [CLAIMING_LIST_COLUMNS.title]: ({ title }) => title || <NoValue />,
    [CLAIMING_LIST_COLUMNS.vendorCode]: ({ vendorCode }) => vendorCode || <NoValue />,
    [CLAIMING_LIST_COLUMNS.vendorName]: ({ vendorName }) => vendorName || <NoValue />,
  };

  return formatter;
};

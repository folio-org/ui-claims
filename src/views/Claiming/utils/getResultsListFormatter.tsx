import React from 'react';
import { IntlShape } from 'react-intl';

import {
  Checkbox,
  NoValue,
} from '@folio/stripes/components';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

import { CLAIMING_LIST_COLUMNS } from '../constants';

import type { ClaimingListColumn } from '../types';

type Claim = ACQ.Claim;
type Formatter = Record<ClaimingListColumn & { select: 'select' }, (item: Claim) => React.ReactNode>;

interface Params {
  intl: IntlShape;
  onSelect: (item: Claim) => void;
}

export const getResultsListFormatter = ({ intl, onSelect }: Params): Formatter => {
  return {
    select: (item: Claim) => (
      <Checkbox
        type="checkbox"
        // checked={Boolean(selectedRecordsMap[record.id])}
        onChange={() => onSelect(item)}
        // aria-label={intl.formatMessage({ id: 'ui-claims.claiming.results.columns.select' })}
        // disabled={isLoading}
      />
    ),
    [CLAIMING_LIST_COLUMNS.chronology]: ({ chronology }: Claim) => (chronology || <NoValue />),
    [CLAIMING_LIST_COLUMNS.displaySummary]: ({ displaySummary }: Claim) => displaySummary || <NoValue />,
    [CLAIMING_LIST_COLUMNS.enumeration]: ({ enumeration }: Claim) => enumeration || <NoValue />,
    [CLAIMING_LIST_COLUMNS.piecesToClaim]: ({ piecesToClaim }: Claim) => piecesToClaim || <NoValue />,
    [CLAIMING_LIST_COLUMNS.poLineNumber]: ({ poLineNumber }: Claim) => poLineNumber || <NoValue />,
    [CLAIMING_LIST_COLUMNS.receiptDate]: ({ receiptDate }: Claim) => <FolioFormattedDate value={receiptDate} />,
    [CLAIMING_LIST_COLUMNS.receivingStatus]: ({ receivingStatus }: Claim) => receivingStatus || <NoValue />,
    [CLAIMING_LIST_COLUMNS.title]: ({ title }: Claim) => title || <NoValue />,
    [CLAIMING_LIST_COLUMNS.vendorCode]: ({ vendorCode }: Claim) => vendorCode || <NoValue />,
    [CLAIMING_LIST_COLUMNS.vendorName]: ({ vendorName }: Claim) => vendorName || <NoValue />,
  };
};
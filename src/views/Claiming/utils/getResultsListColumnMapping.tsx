import React from 'react';
import { IntlShape } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { CLAIMING_LIST_COLUMNS } from '../constants';

import type { ClaimingListColumnMapping } from '../types';

interface Params {
  intl: IntlShape,
  isAllSelected: boolean,
  selectAll: () => void,
  disabled: boolean,
}

export const getResultsListColumnMapping = ({
  intl,
  isAllSelected,
  selectAll,
  disabled,
}: Params): ClaimingListColumnMapping => {
  const mapping = Object.values(CLAIMING_LIST_COLUMNS).reduce((acc, column) => {
    return { ...acc, [column]: intl.formatMessage({ id: `ui-claims.claiming.results.columns.${column}` }) };
  }, {} as Record<keyof typeof CLAIMING_LIST_COLUMNS, React.ReactNode>);

  return {
    ...mapping,
    select: (
      <Checkbox
        aria-label={intl.formatMessage({ id: 'ui-claims.claiming.results.columns.selectAll' })}
        checked={isAllSelected}
        onChange={selectAll}
        type="checkbox"
        disabled={disabled}
      />
    ),
  };
};

import React, { useCallback } from 'react';

import { AccordionSet } from '@folio/stripes/components';
import { PluggableOrganizationFilter } from '@folio/stripes-acq-components';

import { FILTERS } from '../../constants';

import type { ActiveFilters } from '../../types';

interface ClaimingListFiltersProps {
  activeFilters: ActiveFilters;
  applyFilters: (name: string, value: FilterValue) => void;
  disabled: boolean;
  tenantId?: string;
}

type FilterDataShape = { name: string, values: FilterValue };

const applyFiltersAdapter = (applyFilters: ClaimingListFiltersProps['applyFilters']) => ({ name, values }: FilterDataShape) => applyFilters(name, values);

const ClaimingListFilters: React.FC<ClaimingListFiltersProps> = ({
  activeFilters,
  applyFilters,
  disabled,
  tenantId,
}) => {
  const adaptedApplyFilters = useCallback((data: FilterDataShape) => {
    return applyFiltersAdapter(applyFilters)(data);
  }, [applyFilters]);

  return (
    <AccordionSet>
      <PluggableOrganizationFilter
        id={`filter-${FILTERS.ORDER_ORGANIZATION}`}
        activeFilters={activeFilters[FILTERS.ORDER_ORGANIZATION]}
        disabled={disabled}
        labelId="ui-claims.claiming.filters.vendor"
        name={FILTERS.ORDER_ORGANIZATION}
        onChange={adaptedApplyFilters}
        tenantId={tenantId}
      />
    </AccordionSet>
  );
};

export default ClaimingListFilters;

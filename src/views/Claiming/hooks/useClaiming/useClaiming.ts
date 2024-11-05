import { getFiltersCount } from '@folio/stripes-acq-components';

import { useClaims } from '../../../../hooks';
import { buildClaimingQuery } from '../../search';

import type { ActiveFilters } from '../../types';

interface Options {
  filters: ActiveFilters;
  sorting: Sorting;
  pagination: Pagination;
  tenantId?: string;
}

export const useClaiming = ({
  filters,
  sorting,
  pagination,
  tenantId,
}: Options) => {
  const filtersCount = getFiltersCount(filters);

  // moment.tz.setDefault(timezone);

  const query = buildClaimingQuery(filters);

  console.log('query', query);

  // moment.tz.setDefault();

  const data = useClaims(
    {
      limit: pagination.limit,
      offset: pagination.offset,
      query,
    },
    {
      keepPreviousData: true,
      tenantId,
    },
  );

  return data;
};

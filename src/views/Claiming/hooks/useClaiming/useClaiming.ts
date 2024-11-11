import {
  getFiltersCount,
  SEARCH_PARAMETER,
} from '@folio/stripes-acq-components';

import { useClaims } from '../../../../hooks';
import { buildClaimingQuery } from '../../search';

import type { ActiveFilters } from '../../types';

interface Options {
  filters: ActiveFilters & { [SEARCH_PARAMETER]?: string };
  sorting: ACQ.Sorting;
  pagination: ACQ.Pagination;
  tenantId?: string;
}

export const useClaiming = ({
  filters,
  sorting,
  pagination,
  tenantId,
}: Options): ReturnType<typeof useClaims> => {
  const filtersCount = getFiltersCount(filters);

  const query = buildClaimingQuery(filters, sorting);

  const data = useClaims(
    {
      limit: pagination.limit,
      offset: pagination.offset,
      query,
    },
    {
      breakWithDefaults: !filtersCount,
      keepPreviousData: true,
      tenantId,
    },
  );

  return data;
};

import { dayjs } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
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
}: Options): ReturnType<typeof useClaims> => {
  const { timezone } = useStripes();

  const filtersCount = getFiltersCount(filters);

  dayjs.tz.setDefault(timezone as string);

  const query = buildClaimingQuery(filters, sorting);

  dayjs.tz.setDefault();

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

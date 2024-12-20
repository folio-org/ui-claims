import {
  QueryObserverOptions,
  useQuery,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  ALL_RECORDS_CQL,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import { fetchClaims } from '../../utils';

interface Params extends Partial<ACQ.Pagination> {
  query?: string;
}

interface Options extends QueryObserverOptions {
  breakWithDefaults?: boolean;
  tenantId?: string;
}

interface ReturnData {
  claims: ACQ.Claim[];
  totalRecords: number;
  isFetching: boolean;
  isLoading: boolean;
  refetch: () => void;
}

const DEFAULT_DATA: ACQ.Claim[] = [];

export const useClaims = (params: Params = {}, options: Options = {}): ReturnData => {
  const {
    query = ALL_RECORDS_CQL,
    offset = 0,
    limit = LIMIT_MAX,
  } = params;

  const {
    breakWithDefaults = false,
    enabled = true,
    keepPreviousData,
    queryKey,
    tenantId,
  } = options;

  const searchParams = {
    query,
    offset,
    limit,
  };

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'claims' });

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, queryKey, query, offset, limit, tenantId, breakWithDefaults],
    queryFn: async ({ signal }) => {
      if (breakWithDefaults) {
        return {
          claims: DEFAULT_DATA,
          totalRecords: 0,
        };
      }

      return fetchClaims(ky)({ searchParams, signal });
    },
    enabled,
    keepPreviousData,
  });

  return {
    claims: data?.claims || DEFAULT_DATA,
    totalRecords: data?.totalRecords || 0,
    isFetching,
    isLoading,
    refetch,
  };
};

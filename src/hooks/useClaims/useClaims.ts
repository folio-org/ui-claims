import {
  QueryObserverOptions,
  useQuery,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { ALL_RECORDS_CQL } from '../../constants';
import { fetchClaims } from '../../utils';

interface Params extends Partial<Pagination> {
  query?: string;
}

interface Options extends QueryObserverOptions {
  breakWithDefaults?: boolean;
  tenantId?: string;
}

interface Data {
  pieces: ACQ.Claim[];
  totalRecords: number;
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
          pieces: DEFAULT_DATA,
          totalRecords: 0,
        };
      }

      return fetchClaims<Data>(ky)({ searchParams, signal });
    },
    enabled,
    keepPreviousData,
  });

  return {
    claims: data?.pieces || DEFAULT_DATA,
    totalRecords: data?.totalRecords || 0,
    isFetching,
    isLoading,
    refetch,
  };
};

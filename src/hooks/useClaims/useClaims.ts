import {
  QueryObserverOptions,
  useQuery,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  ALL_RECORDS_CQL,
  CLAIMS_API,
} from '../../constants';

interface Params extends Partial<Pagination> {
  query?: string;
}

interface Options extends QueryObserverOptions {
  tenantId?: string;
  keepPreviousData?: boolean;
}

interface Data {
  pieces: ACQ.Claim[];
  totalRecords: number;
}

const DEFAULT_DATA: ACQ.Claim[] = [];

export const useClaims = (params: Params = {}, options: Options = {}) => {
  const {
    query = ALL_RECORDS_CQL,
    offset = 0,
    limit = LIMIT_MAX,
  } = params;

  const {
    enabled = true,
    keepPreviousData,
    tenantId,
    queryKey,
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
    queryKey: [namespace, queryKey, query, offset, limit, tenantId],
    queryFn: async ({ signal }) => {
      return ky.get(CLAIMS_API, { searchParams, signal }).json<Data>();
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

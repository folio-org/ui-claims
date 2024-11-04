import {
  QueryObserverOptions,
  useQuery,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  ORDER_PIECES_API,
  RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';

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
    query = '',
    offset = 0,
    limit = RESULT_COUNT_INCREMENT,
  } = params;

  const {
    enabled = true,
    keepPreviousData,
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
    queryKey: [namespace, query, offset, limit, tenantId],
    queryFn: async ({ signal }) => {
      return ky.get(ORDER_PIECES_API, { searchParams, signal }).json<Data>();
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

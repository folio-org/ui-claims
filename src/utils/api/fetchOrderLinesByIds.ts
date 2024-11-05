import { batchRequest } from '@folio/stripes-acq-components';

import type {
  HTTPClient,
  HTTPClientOptions,
  HTTPClientSearchParams,
} from '../../typing';

import { fetchOrderLines } from './fetchOrderLines';

type DataShape = Awaited<ReturnType<ReturnType<typeof fetchOrderLines>>>

export const fetchOrderLinesByIds = (httpClient: HTTPClient) => {
  return (ids: string[], options: HTTPClientOptions): Promise<DataShape> => {
    const requestFn = ({ params }: { params: HTTPClientSearchParams }) => {
      return fetchOrderLines(httpClient)({ ...options, searchParams: params });
    };

    return batchRequest(requestFn, ids).then((responses: DataShape[]) => {
      return responses.reduce((acc, response) => {
        return {
          poLines: acc.poLines.concat(response.poLines),
          totalRecords: acc.totalRecords + response.totalRecords,
        };
      }, { poLines: [], totalRecords: 0 });
    });
  };
};

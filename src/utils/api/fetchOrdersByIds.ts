import { batchRequest } from '@folio/stripes-acq-components';

import type {
  HTTPClient,
  HTTPClientOptions,
  HTTPClientSearchParams,
} from '../../typing';

import { fetchOrders } from './fetchOrders';

type DataShape = Awaited<ReturnType<ReturnType<typeof fetchOrders>>>

export const fetchOrdersByIds = (httpClient: HTTPClient) => {
  return (ids: string[], options: HTTPClientOptions): Promise<DataShape> => {
    const requestFn = ({ params }: { params: HTTPClientSearchParams }) => {
      return fetchOrders(httpClient)({ ...options, searchParams: params });
    };

    return batchRequest(requestFn, ids).then((responses: DataShape[]) => {
      return responses.reduce((acc, response) => {
        return {
          purchaseOrders: acc.purchaseOrders.concat(response.purchaseOrders),
          totalRecords: acc.totalRecords + response.totalRecords,
        };
      }, { purchaseOrders: [], totalRecords: 0 });
    });
  };
};

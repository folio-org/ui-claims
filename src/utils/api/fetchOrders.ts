import { ORDERS_API } from '@folio/stripes-acq-components';

import type {
  HTTPClient,
  HTTPClientOptions,
} from '@folio/stripes-acq-components';

interface DataShape {
  purchaseOrders: ACQ.Order[];
  totalRecords: number;
}

export const fetchOrders = (httpClient: HTTPClient) => async (options: HTTPClientOptions): Promise<DataShape> => {
  return httpClient.get(ORDERS_API, options).json<DataShape>();
};

import { LINES_API } from '@folio/stripes-acq-components';

import type {
  HTTPClient,
  HTTPClientOptions,
} from '@folio/stripes-acq-components';

interface DataShape {
  poLines: ACQ.OrderLine[];
  totalRecords: number;
}

export const fetchOrderLines = (httpClient: HTTPClient) => async (options: HTTPClientOptions): Promise<DataShape> => {
  return httpClient.get(LINES_API, options).json<DataShape>();
};

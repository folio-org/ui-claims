import type {
  HTTPClient,
  HTTPClientOptions,
} from '../../typing';

import { RECEIVING_TITLES_API } from '../../constants';

interface DataShape {
  titles: ACQ.Title[];
  totalRecords: number;
}

export const fetchReceivingTitles = (httpClient: HTTPClient) => {
  return async (options: HTTPClientOptions): Promise<DataShape> => {
    return httpClient.get(RECEIVING_TITLES_API, options).json<DataShape>();
  };
};

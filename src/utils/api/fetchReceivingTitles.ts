import type {
  HTTPClient,
  HTTPClientOptions,
} from '@folio/stripes-acq-components';

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

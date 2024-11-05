import { VENDORS_API } from '@folio/stripes-acq-components';

import type {
  HTTPClient,
  HTTPClientOptions,
} from '../../typing';

interface DataShape {
  organizations: ACQ.Organization[];
  totalRecords: number;
}

export const fetchOrganizations = (httpClient: HTTPClient) => {
  return async (options: HTTPClientOptions): Promise<DataShape> => {
    return httpClient.get(VENDORS_API, options).json<DataShape>();
  };
};

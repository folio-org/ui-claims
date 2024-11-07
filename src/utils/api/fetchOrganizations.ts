import { VENDORS_API } from '@folio/stripes-acq-components';

import type {
  HTTPClient,
  HTTPClientOptions,
} from '@folio/stripes-acq-components';

interface DataShape {
  organizations: ACQ.Organization[];
  totalRecords: number;
}

export const fetchOrganizations = (httpClient: HTTPClient) => {
  return async (options: HTTPClientOptions): Promise<DataShape> => {
    return httpClient.get(VENDORS_API, options).json<DataShape>();
  };
};

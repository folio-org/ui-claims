import { batchRequest } from '@folio/stripes-acq-components';

import type {
  HTTPClient,
  HTTPClientOptions,
  HTTPClientSearchParams,
} from '../../typing';

import { fetchOrganizations } from './fetchOrganizations';

type DataShape = Awaited<ReturnType<ReturnType<typeof fetchOrganizations>>>

export const fetchOrganizationsByIds = (httpClient: HTTPClient) => {
  return (ids: string[], options: HTTPClientOptions): Promise<DataShape> => {
    const requestFn = ({ params }: { params: HTTPClientSearchParams }) => {
      return fetchOrganizations(httpClient)({ ...options, searchParams: params });
    };

    return batchRequest(requestFn, ids).then((responses: DataShape[]) => {
      return responses.reduce((acc, response) => {
        return {
          organizations: acc.organizations.concat(response.organizations),
          totalRecords: acc.totalRecords + response.totalRecords,
        };
      }, { organizations: [], totalRecords: 0 });
    });
  };
};

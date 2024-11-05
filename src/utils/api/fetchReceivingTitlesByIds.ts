import { batchRequest } from '@folio/stripes-acq-components';

import type {
  HTTPClient,
  HTTPClientOptions,
  HTTPClientSearchParams,
} from '../../typing';

import { fetchReceivingTitles } from './fetchReceivingTitles';

type DataShape = Awaited<ReturnType<ReturnType<typeof fetchReceivingTitles>>>

export const fetchReceivingTitlesByIds = (httpClient: HTTPClient) => {
  return (ids: string[], options: HTTPClientOptions): Promise<DataShape> => {
    const requestFn = ({ params }: { params: HTTPClientSearchParams }) => {
      return fetchReceivingTitles(httpClient)({ ...options, searchParams: params });
    };

    return batchRequest(requestFn, ids).then((responses: DataShape[]) => {
      return responses.reduce((acc, response) => {
        return {
          titles: acc.titles.concat(response.titles),
          totalRecords: acc.totalRecords + response.totalRecords,
        };
      }, { titles: [], totalRecords: 0 });
    });
  };
};

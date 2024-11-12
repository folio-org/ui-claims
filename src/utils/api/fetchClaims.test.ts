import type { HTTPClient } from '@folio/stripes-acq-components';
import {
  fetchPieces,
  fetchOrderLinesByIds,
  fetchOrdersByIds,
  fetchOrganizationsByIds,
  fetchReceivingTitlesByIds,
} from '@folio/stripes-acq-components';

import { fetchClaims } from './fetchClaims';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  fetchPieces: jest.fn(() => () => ({ pieces: [] })),
  fetchOrderLinesByIds: jest.fn(() => () => ({ poLines: [] })),
  fetchOrdersByIds: jest.fn(() => () => ({ purchaseOrders: [] })),
  fetchOrganizationsByIds: jest.fn(() => () => ({ organizations: [] })),
  fetchReceivingTitlesByIds: jest.fn(() => () => ({ titles: [] })),
}));

const httpClient = {
  get: jest.fn(() => ({
    json: jest.fn(() => Promise.resolve({})),
  })),
} as unknown as HTTPClient;

const options = {
  signal: new AbortController().signal,
};

describe('fetchClaims', () => {
  it('should fetch claims', async () => {
    await fetchClaims(httpClient)(options);

    expect(fetchPieces).toHaveBeenCalled();
    expect(fetchOrderLinesByIds).toHaveBeenCalled();
    expect(fetchOrdersByIds).toHaveBeenCalled();
    expect(fetchOrganizationsByIds).toHaveBeenCalled();
    expect(fetchReceivingTitlesByIds).toHaveBeenCalled();
  });
});

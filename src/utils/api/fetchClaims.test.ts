import type { HTTPClient } from '@folio/stripes-acq-components';
import {
  fetchOrganizationsByIds,
} from '@folio/stripes-acq-components';

import { fetchClaims } from './fetchClaims';
import { fetchWrapperPieces } from './fetchWrapperPieces';

jest.mock('./fetchWrapperPieces', () => ({
  fetchWrapperPieces: jest.fn(() => () => ({ wrapperPieces: [
    { vendorId: '1',
      title: { title: 'title 1' },
      poLine: { poLineNumber: '1' },
      piece: { id: '1' } },
    { vendorId: '2',
      title: { title: 'title 2' },
      poLine: { poLineNumber: '2' },
      piece: { id: '2' } },
  ] })),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  fetchOrganizationsByIds: jest.fn(() => () => ({ organizations: [
    { id: '1', code: 'code 1', name: 'name 1' },
    { id: '2', code: 'code 2', name: 'name 2' },
  ] })),
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

    expect(fetchWrapperPieces).toHaveBeenCalled();
    expect(fetchOrganizationsByIds).toHaveBeenCalled();
  });
});

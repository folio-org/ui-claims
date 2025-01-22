import type { HTTPClient } from '@folio/stripes-acq-components';

import { ORDER_WRAPPER_PIECES_API } from '../../constants';
import { fetchWrapperPieces } from './fetchWrapperPieces';

const httpClient = {
  get: jest.fn(() => ({
    json: jest.fn(() => Promise.resolve({})),
  })),
} as unknown as HTTPClient;

const options = {
  signal: new AbortController().signal,
};

describe('fetchWrapperPieces', () => {
  it('should call the correct API endpoint with the provided options', async () => {
    await fetchWrapperPieces(httpClient)(options);

    expect(httpClient.get).toHaveBeenCalledWith(ORDER_WRAPPER_PIECES_API, options);
  });
});

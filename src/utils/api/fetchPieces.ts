import { ORDER_PIECES_API } from '@folio/stripes-acq-components';

import type {
  HTTPClient,
  HTTPClientOptions,
} from '@folio/stripes-acq-components';

interface DataShape {
  pieces: ACQ.Piece[];
  totalRecords: number;
}

export const fetchPieces = (httpClient: HTTPClient) => async (options: HTTPClientOptions): Promise<DataShape> => {
  return httpClient.get(ORDER_PIECES_API, options).json<DataShape>();
};

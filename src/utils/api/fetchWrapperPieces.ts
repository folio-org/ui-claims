import type {
  HTTPClient,
  HTTPClientOptions,
} from '@folio/stripes-acq-components';

import { ORDER_WRAPPER_PIECES_API } from '../../constants';

interface WrapperPiece {
    piece: ACQ.Piece;
    poLine: ACQ.OrderLine;
    purchaseOrder: ACQ.Order;
    title: ACQ.Title;
    vendorId: string;
}

interface WrapperDataShape {
  wrapperPieces: WrapperPiece[];
  totalRecords: number;
}

export const fetchWrapperPieces =
(httpClient: HTTPClient) => async (options: HTTPClientOptions): Promise<WrapperDataShape> => {
  return httpClient.get(ORDER_WRAPPER_PIECES_API, options).json();
};

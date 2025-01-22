import keyBy from 'lodash/keyBy';

import type {
  HTTPClient,
  HTTPClientOptions,
} from '@folio/stripes-acq-components';

import {
  fetchOrganizationsByIds,
} from '@folio/stripes-acq-components';

interface DataShape {
  claims: ACQ.Claim[];
  totalRecords: number;
}

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

const ORDER_WRAPPER_PIECES_API = 'orders/wrapper-pieces';

const fetchWrapperPieces =
(httpClient: HTTPClient) => async (options: HTTPClientOptions): Promise<WrapperDataShape> => {
  return httpClient.get(ORDER_WRAPPER_PIECES_API, options).json();
};

export const fetchClaims = (httpClient: HTTPClient) => async (options: HTTPClientOptions): Promise<DataShape> => {
  const { signal } = options;
  const { wrapperPieces, totalRecords } = await fetchWrapperPieces(httpClient)(options);

  const organizationIdsSet = new Set<string>(wrapperPieces.map(({ vendorId }) => vendorId));
  const { organizations } = await fetchOrganizationsByIds(httpClient)(
    Array.from(organizationIdsSet), { signal },
  );

  const organizationsDict = keyBy(organizations, 'id');

  return {
    claims: wrapperPieces.map(({ piece, vendorId, poLine, title }) => {
      const vendor = organizationsDict[vendorId];

      return {
        ...piece,
        title: title.title,
        vendorCode: vendor.code,
        vendorName: vendor.name,
        poLineNumber: poLine.poLineNumber,
      };
    }),
    totalRecords,
  };
};

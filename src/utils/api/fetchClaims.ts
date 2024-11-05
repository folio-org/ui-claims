import type {
  HTTPClient,
  HTTPClientOptions,
} from '../../typing';

import { fetchPieces } from './fetchPieces';
import { fetchOrderLinesByIds } from './fetchOrderLinesByIds';
import { fetchOrdersByIds } from './fetchOrdersByIds';
import { fetchOrganizationsByIds } from './fetchOrganizationsByIds';
import { fetchReceivingTitlesByIds } from './fetchReceivingTitlesByIds';

interface DataShape {
  claims: ACQ.Claim[];
  totalRecords: number;
}

export const fetchClaims = (httpClient: HTTPClient) => async (options: HTTPClientOptions): Promise<DataShape> => {
  const { signal } = options;

  const { pieces, totalRecords } = await fetchPieces(httpClient)(options);

  const titleIdsSet = new Set(pieces.map(({ titleId }) => titleId));
  const poLineIdsSet = new Set(pieces.map(({ poLineId }) => poLineId));

  const [{ titles }, { poLines }] = await Promise.all([
    fetchReceivingTitlesByIds(httpClient)(Array.from(titleIdsSet), { signal }),
    fetchOrderLinesByIds(httpClient)(Array.from(poLineIdsSet), { signal }),
  ]);

  const orderIdsSet = new Set(poLines.map(({ purchaseOrderId }) => purchaseOrderId));
  const { purchaseOrders } = await fetchOrdersByIds(httpClient)(Array.from(orderIdsSet), { signal });

  const organizationIdsSet = new Set(purchaseOrders.map(({ vendor }) => vendor));
  const { organizations } = await fetchOrganizationsByIds(httpClient)(Array.from(organizationIdsSet), { signal });

  console.log('poLines', poLines);
  console.log('titles', titles);
  console.log('purchaseOrders', purchaseOrders);
  console.log('organizations', organizations);

  return {
    claims: pieces.map((piece) => ({
      ...piece,
      title: '',
      vendorCode: '',
      vendorName: '',
      poLineNumber: '',
      piecesToClaim: 0,
    })),
    totalRecords,
  };
};

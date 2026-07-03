import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import {
  CQLBuilder,
  ORDER_FORMATS,
  SEARCH_PARAMETER,
} from '@folio/stripes-acq-components';

import { useClaims } from '../../../../hooks';
import { FILTERS } from '../../constants';
import { useClaiming } from './useClaiming';

jest.mock('../../../../hooks', () => ({
  useClaims: jest.fn(),
}));

const mockUseClaims = useClaims as jest.Mock;

const {
  AND,
  EQUAL,
  FUZZY,
  OR,
} = CQLBuilder.OPERATORS;
const LOWER_AND = AND.toLocaleLowerCase();
const LOWER_OR = OR.toLocaleLowerCase();

const group = (query: string | string[], joiner = ` ${LOWER_AND} `) => {
  return Array.isArray(query)
    ? `(${query.join(joiner)})`
    : `(${query})`;
};

describe('useClaiming', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseClaims.mockReturnValue({ data: [], isLoading: false });
  });

  it('should return data from useClaims', () => {
    const options = {
      filters: {},
      sorting: {
        sorting: 'receiptDate',
        sortingDirection: 'ascending' as ACQ.SortingOrder,
      },
      pagination: { limit: 10, offset: 0 },
      tenantId: 'tenantId',
    };

    const { result } = renderHook(() => useClaiming(options));

    expect(result.current).toEqual({ data: [], isLoading: false });
    expect(mockUseClaims).toHaveBeenCalledWith(
      {
        limit: options.pagination.limit,
        offset: options.pagination.offset,
        query: '(cql.allRecords=1) sortby piece.receiptDate/sort.ascending',
      },
      {
        breakWithDefaults: true,
        keepPreviousData: true,
        tenantId: options.tenantId,
      },
    );
  });

  it('should handle filters count correctly', () => {
    const options = {
      filters: {
        [SEARCH_PARAMETER]: 'search-query',
        [FILTERS.LOCATION]: 'location-id',
        [FILTERS.MATERIAL_TYPE]: 'material-type',
        [FILTERS.ORDER_FORMAT]: ORDER_FORMATS.physicalResource,
      },
      sorting: {
        sorting: 'receiptDate',
        sortingDirection: 'ascending' as ACQ.SortingOrder,
      },
      pagination: { limit: 10, offset: 0 },
      tenantId: 'tenantId',
    };

    renderHook(() => useClaiming(options));

    expect(mockUseClaims).toHaveBeenCalledWith(
      {
        limit: options.pagination.limit,
        offset: options.pagination.offset,
        query: [
          group([
            group([
              `title.title${FUZZY}"search-query"`,
              `poLine.titleOrPackage${FUZZY}"search-query"`,
              `title.productIds${FUZZY}"search-query"`,
              `purchaseOrder.poNumber${EQUAL}"search-query"`,
              `poLine.poLineNumber${EQUAL}"search-query"`,
              `poLine.vendorDetail.referenceNumbers${FUZZY}"search-query"`,
            ], ` ${LOWER_OR} `),
            group([
              `poLine.locations${EQUAL}"*location-id*"`,
              `poLine.searchLocationIds${EQUAL}"*location-id*"`,
            ], ` ${OR} `),
            group(
              group([
                `poLine.orderFormat${EQUAL}"Physical Resource"`,
                group(`poLine.physical.materialType${EQUAL}"material-type"`),
              ]),
            ),
          ].join(` ${LOWER_AND} `)),
          'sortby piece.receiptDate/sort.ascending',
        ].join(' '),
      },
      {
        breakWithDefaults: false,
        keepPreviousData: true,
        tenantId: options.tenantId,
      },
    );
  });
});

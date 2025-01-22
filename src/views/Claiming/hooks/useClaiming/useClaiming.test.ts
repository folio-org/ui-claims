import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import {
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
        query: (`
          ((title.title=="*search-query*" or poLine.titleOrPackage=="*search-query*" or title.productIds=="*search-query*" or purchaseOrder.poNumber=="*search-query*" or poLine.poLineNumber=="*search-query*" or poLine.vendorDetail.referenceNumbers=="*search-query*")
          and (poLine.locations=="*location-id*" or poLine.searchLocationIds=="*location-id*")
          and ((poLine.orderFormat=="Physical Resource" and (poLine.physical.materialType=="material-type"))))
          sortby piece.receiptDate/sort.ascending
        `).replace(/\s+/g, ' ').trim(),
      },
      {
        breakWithDefaults: false,
        keepPreviousData: true,
        tenantId: options.tenantId,
      },
    );
  });
});

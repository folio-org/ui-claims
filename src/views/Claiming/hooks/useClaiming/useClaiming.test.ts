import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useClaims } from '../../../../hooks';
import { useClaiming } from './useClaiming';
import { FILTERS } from '../../constants';

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
        query: '(cql.allRecords=1) sortby receiptDate/sort.ascending',
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
        [FILTERS.LOCATION]: 'location-id',
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
        query: '((poLine.locations=="*location-id*" or poLine.searchLocationIds=="*location-id*")) sortby receiptDate/sort.ascending',
      },
      {
        breakWithDefaults: false,
        keepPreviousData: true,
        tenantId: options.tenantId,
      },
    );
  });
});

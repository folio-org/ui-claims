import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { fetchClaims } from '../../utils';
import { useClaims } from './useClaims';

jest.mock('../../utils', () => ({
  fetchClaims: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockFetchClaimsFn = fetchClaims as jest.MockedFunction<typeof fetchClaims>;

describe('useClaims', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return default data when breakWithDefaults is true', async () => {
    const mockFetchClaims = jest.fn().mockResolvedValue({
      claims: [],
      totalRecords: 0,
    });

    mockFetchClaimsFn.mockReturnValue(mockFetchClaims);

    const { result } = renderHook(() => useClaims({}, { breakWithDefaults: true }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.claims).toEqual([]);
    expect(result.current.totalRecords).toBe(0);
  });

  it('should fetch claims data', async () => {
    const mockClaims = [{ id: '1', claim: 'claim1' }];
    const mockFetchClaims = jest.fn().mockResolvedValue({
      claims: mockClaims,
      totalRecords: 1,
    });

    mockFetchClaimsFn.mockReturnValue(mockFetchClaims);

    const { result } = renderHook(() => useClaims(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.claims).toEqual(mockClaims);
    expect(result.current.totalRecords).toBe(1);
  });

  it('should handle query params', async () => {
    const mockClaims = [{ id: '1', claim: 'claim1' }];
    const mockFetchClaims = jest.fn().mockResolvedValue({
      claims: mockClaims,
      totalRecords: 1,
    });

    mockFetchClaimsFn.mockReturnValue(mockFetchClaims);

    const params = { query: 'test-query', offset: 10, limit: 5 };
    const { result } = renderHook(() => useClaims(params), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.claims).toEqual(mockClaims);
    expect(result.current.totalRecords).toBe(1);
  });

  it('should handle tenantId option', async () => {
    const mockClaims = [{ id: '1', claim: 'claim1' }];
    const mockFetchClaims = jest.fn().mockResolvedValue({
      claims: mockClaims,
      totalRecords: 1,
    });

    mockFetchClaimsFn.mockReturnValue(mockFetchClaims);

    const options = { tenantId: 'test-tenant' };
    const { result } = renderHook(() => useClaims({}, options), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.claims).toEqual(mockClaims);
    expect(result.current.totalRecords).toBe(1);
  });
});

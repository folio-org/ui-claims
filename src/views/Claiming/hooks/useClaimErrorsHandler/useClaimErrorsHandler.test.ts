import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
import { useShowCallout } from '@folio/stripes-acq-components';

import { RESPONSE_ERROR_CODE } from '../../constants';
import { useClaimErrorsHandler } from './useClaimErrorsHandler';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));

const MockErrorResponse = jest.fn().mockImplementation((body: BodyInit) => {
  return {
    body,
    clone: jest.fn().mockReturnThis(),
    json: jest.fn().mockResolvedValueOnce(body),
  } as unknown as Response;
});

describe('useClaimErrorsHandler', () => {
  const showCalloutMock = jest.fn();
  const callback = jest.fn();

  beforeEach(() => {
    (useShowCallout as jest.Mock).mockReturnValue(showCalloutMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createErrorResponse = (code: string, message: string) => {
    return new MockErrorResponse({
      errors: [
        {
          code,
          message,
          parameters: [{ key: 'key1', value: 'value1' }],
        },
      ],
      total_records: 1,
    });
  };

  it('should handle "cannotFindPiecesWithLatestStatusToProcess" error correctly', async () => {
    const response = createErrorResponse(
      RESPONSE_ERROR_CODE.cannotFindPiecesWithLatestStatusToProcess,
      'Cannot find pieces with latest status to process',
    );

    const { result } = renderHook(() => useClaimErrorsHandler());

    await act(async () => {
      await result.current.handlerErrorResponse(response, {
        callbacksDict: {
          [RESPONSE_ERROR_CODE.cannotFindPiecesWithLatestStatusToProcess]: callback,
        },
      });
    });

    expect(callback).toHaveBeenCalled();
    expect(showCalloutMock).toHaveBeenCalled();
  });

  it('should handle "unableToGenerateClaimsForOrgNoIntegrationDetails" error correctly', async () => {
    const response = createErrorResponse(
      RESPONSE_ERROR_CODE.unableToGenerateClaimsForOrgNoIntegrationDetails,
      'Unable to generate claims for org with no integration details',
    );

    const { result } = renderHook(() => useClaimErrorsHandler());

    await act(async () => {
      await result.current.handlerErrorResponse(response, {
        callbacksDict: {
          [RESPONSE_ERROR_CODE.unableToGenerateClaimsForOrgNoIntegrationDetails]: callback,
        },
      });
    });

    expect(callback).toHaveBeenCalled();
    expect(showCalloutMock).toHaveBeenCalled();
  });

  it('should handle "genericError" error correctly', async () => {
    const response = createErrorResponse(
      RESPONSE_ERROR_CODE.genericError,
      'A generic error occurred',
    );

    const { result } = renderHook(() => useClaimErrorsHandler());

    await act(async () => {
      await result.current.handlerErrorResponse(response, {
        callbacksDict: {
          [RESPONSE_ERROR_CODE.genericError]: callback,
        },
      });
    });

    expect(callback).toHaveBeenCalled();
    expect(showCalloutMock).toHaveBeenCalled();
  });
});

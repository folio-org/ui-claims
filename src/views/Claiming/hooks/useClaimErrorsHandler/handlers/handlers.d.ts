import { useShowCallout } from '@folio/stripes-acq-components';

import { RESPONSE_ERROR_CODE } from '../../../constants';

export type ResponseErrorCode = typeof RESPONSE_ERROR_CODE[keyof typeof RESPONSE_ERROR_CODE];
export type CallbackFn = (...args: unknown[]) => unknown;
export type CallbacksDict = Partial<Record<ResponseErrorCode, CallbackFn>>;

export interface ErrorHandlingStrategyBaseParams {
  callback?: CallbackFn,
  showCallout: ReturnType<typeof useShowCallout>,
}

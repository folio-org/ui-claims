import type {
  ErrorHandlingStrategy,
  ResponseErrorsContainer,
} from '@folio/stripes-acq-components';

import type { ErrorHandlingStrategyBaseParams } from './handlers';

interface ErrorHandlingStrategyParams extends ErrorHandlingStrategyBaseParams {
  defaultMessageId?: string,
}

export const genericErrorStrategy = ({
  callback,
  defaultMessageId,
  showCallout,
}: ErrorHandlingStrategyParams): ErrorHandlingStrategy => {
  const handle = async (errorsContainer: ResponseErrorsContainer) => {
    await callback?.(errorsContainer);

    showCallout({
      messageId: defaultMessageId || 'stripes-components.ErrorBoundary.defaultTitle',
      type: 'error',
    });
  };

  return { handle };
};

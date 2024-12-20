import type {
  ErrorHandlingStrategy,
  ResponseErrorsContainer,
} from '@folio/stripes-acq-components';

import type { ErrorHandlingStrategyBaseParams } from './handlers';

import { RESPONSE_ERROR_CODE } from '../../../constants';

export const expectedLateStatusForPieceStrategy = ({
  callback,
  showCallout,
}: ErrorHandlingStrategyBaseParams): ErrorHandlingStrategy => {
  const handle = async (errorsContainer: ResponseErrorsContainer) => {
    const error = errorsContainer.getError();

    const pieceIds = error.parameters
      .filter(({ key }) => key === 'pieceId')
      .map(({ value }) => value);

    await callback?.({ pieceIds });

    showCallout({
      messageId: `ui-claims.error.code.${RESPONSE_ERROR_CODE.cannotFindPiecesWithLatestStatusToProcess}`,
      type: 'error',
    });
  };

  return { handle };
};

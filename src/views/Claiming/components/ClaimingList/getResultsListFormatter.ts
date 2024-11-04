import { ReactNode } from 'react';

import { CLAIM_FIELDS } from '../../constants';

export const getResultsListFormatter = (): Record<string, (item: ACQ.Claim) => ReactNode> => {
  return {
    [CLAIM_FIELDS.receivingStatus]: (claim) => {
      return claim.receivingStatus;
    },
    [CLAIM_FIELDS.title]: (claim) => {
      return claim.title;
    },
    [CLAIM_FIELDS.expectedReceiptDate]: (claim) => {
      return claim.expectedReceiptDate;
    },
  };
};

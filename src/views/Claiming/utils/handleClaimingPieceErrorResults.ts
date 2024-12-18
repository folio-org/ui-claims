import {
  ClaimingPieceResult,
  useShowCallout,
} from '@folio/stripes-acq-components';

export const handleClaimingPieceErrorResults = (
  claimingPieceResults: ClaimingPieceResult[],
  showCallout: ReturnType<typeof useShowCallout>,
): void => {
  claimingPieceResults
    .reduce((acc, curr) => {
      return curr?.error?.message ? acc.add(curr.error.message) : acc;
    }, new Set<string>())
    .forEach((message) => {
      showCallout({
        message,
        type: 'error',
      });
    });
};

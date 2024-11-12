import { IntlShape } from 'react-intl';

import { CLAIMING_LIST_COLUMNS } from '../constants';
import { getResultsListFormatter } from './getResultsListFormatter';

describe('getResultsListFormatter', () => {
  it('should results list formatter', () => {
    const params: Parameters<typeof getResultsListFormatter>[0] = {
      intl: { formatMessage: jest.fn() } as unknown as IntlShape,
      onSelect: jest.fn(),
      disabled: false,
    };

    const mapping = getResultsListFormatter(params);

    Object.values(CLAIMING_LIST_COLUMNS).forEach((column) => {
      expect(column in mapping).toBeTruthy();
    });
  });
});

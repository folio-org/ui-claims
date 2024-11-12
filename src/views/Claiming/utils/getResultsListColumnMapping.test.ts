import { IntlShape } from 'react-intl';

import { CLAIMING_LIST_COLUMNS } from '../constants';
import { getResultsListColumnMapping } from './getResultsListColumnMapping';

describe('getResultsListColumnMapping', () => {
  it('should return correct mapping for columns', () => {
    const params: Parameters<typeof getResultsListColumnMapping>[0] = {
      intl: { formatMessage: jest.fn() } as unknown as IntlShape,
      selectAll: jest.fn(),
      disabled: false,
    };

    const mapping = getResultsListColumnMapping(params);

    Object.values(CLAIMING_LIST_COLUMNS).forEach((column) => {
      expect(column in mapping).toBeTruthy();
    });
  });
});

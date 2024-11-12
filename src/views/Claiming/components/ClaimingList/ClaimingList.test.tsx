import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { claim } from 'fixtures';
import { CLAIMING_LIST_COLUMNS } from '../../constants';
import ClaimingList from './ClaimingList';

import type { ClaimingListColumn } from '../../types';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useItemToView: jest.fn(() => ({
    itemToView: 'itemToView',
    setItemToView: jest.fn(),
    deleteItemToView: jest.fn(),
  })),
}));

const columnMapping = Object.values(CLAIMING_LIST_COLUMNS).reduce((acc, column) => {
  return { ...acc, [column]: column };
}, {} as Record<keyof typeof CLAIMING_LIST_COLUMNS, React.ReactNode>);

const defaultProps: Parameters<typeof ClaimingList>[0] = {
  columnMapping,
  contentData: [claim],
  height: 100,
  isEmptyMessage: 'Empty',
  isLoading: false,
  onHeaderClick: jest.fn(),
  onNeedMoreData: jest.fn(),
  onSelect: jest.fn(),
  pagination: { limit: 10, offset: 0 },
  totalCount: 0,
  visibleColumns: Object.keys(columnMapping) as ClaimingListColumn[],
  width: 100,
};

const renderComponent = (props = {}) => render(
  <ClaimingList
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('ClaimingList', () => {
  it('should render component', () => {
    renderComponent();

    defaultProps.visibleColumns.forEach((column) => {
      expect(screen.getByText(column)).toBeInTheDocument();
    });
  });
});

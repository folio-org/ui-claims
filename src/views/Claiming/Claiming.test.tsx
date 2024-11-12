import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { claim } from 'fixtures';
import { Claiming } from './Claiming';
import { useClaiming } from './hooks';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  useCustomFields: jest.fn(() => ([[]])),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqTagsFilter: () => 'AcqTagsFilter',
  AcqUnitFilter: () => 'AcqUnitFilter',
  CustomFieldsFilters: () => 'CustomFieldsFilters',
  LocationFilterContainer: () => 'LocationFilterContainer',
  MaterialTypeFilterContainer: () => 'MaterialTypeFilterContainer',
  PluggableOrganizationFilter: () => 'PluggableOrganizationFilter',
  PluggableUserFilter: () => 'PluggableUserFilter',
  useAddresses: jest.fn(() => ({ addresses: [] })),
  useItemToView: jest.fn(() => ({
    itemToView: 'itemToView',
    setItemToView: jest.fn(),
    deleteItemToView: jest.fn(),
  })),
  useFiltersToogle: jest.fn(() => ({ isFiltersOpened: true, toggleFilters: jest.fn() })),
}));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useClaiming: jest.fn(),
}));

const renderComponent = (props = {}) => render(
  <Claiming {...props} />,
  { wrapper: MemoryRouter },
);

describe('Claiming', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useClaiming as jest.Mock).mockReturnValue({
      claims: [claim],
    });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('ui-claims.claiming.results.title')).toBeInTheDocument();
  });
});

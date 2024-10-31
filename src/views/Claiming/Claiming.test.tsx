import React from 'react';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { Claiming } from './Claiming';

const renderComponent = (props = {}) => render(
  <Claiming {...props} />,
);

describe('Claiming', () => {
  it('should render component', () => {
    renderComponent();
    expect(screen.getByText('Claiming Route')).toBeInTheDocument();
  });
});

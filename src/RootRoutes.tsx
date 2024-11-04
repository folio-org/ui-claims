import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { CLAIMING_ROUTE } from './constants';
import { Claiming } from './views';

export const RootRoutes = () => {
  return (
    <Switch>
      <Route
        path={CLAIMING_ROUTE}
        component={Claiming}
      />
    </Switch>
  );
};

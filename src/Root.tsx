import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { CLAIMING_ROUTE } from './constants';
import { Claiming } from './views';

export default class Root extends React.Component {
  render(): React.JSX.Element {
    return (
      <Switch>
        <Route path={CLAIMING_ROUTE} component={Claiming} />
      </Switch>
    );
  }
}

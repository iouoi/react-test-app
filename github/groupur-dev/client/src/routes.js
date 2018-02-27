import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CreateGroup from './components/create_group';

import App from './components/App';


const Routes = () => {
  return (
    <Switch>
      <Route path="/add-group" exact component={CreateGroup} />
      <Route path="/" exact component={App} />

    </Switch>
  )
}

export default Routes;
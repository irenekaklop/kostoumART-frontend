import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import NotFound from './components/NotFound/NotFound';
import Dashboard from './components/Dashboard/Dashboard';

const Routes = () => (
    <BrowserRouter >
    <Switch>
        <Route exact path='/kostoumart-dashboard' component={Dashboard}/>
        <Route exact path="/login" component={Welcome}/>
        <Route path="*" component={NotFound}/>
    </Switch>
    </BrowserRouter>
);

export default Routes;
import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import NotFound from './components/NotFound/NotFound';
import Dashboard from './components/Dashboard/Dashboard';
import Auth from './components/Auth/Auth';

const Routes = () => (
    <BrowserRouter basename="/kostoumart">
    <Switch>
        <Route path='/kostoumart-dashboard' component={Dashboard}/>
        <Route path="/welcome" component={Welcome}/>
        <Route path="/auth" component={Auth}/>
        <Route path="*" component={NotFound}/>
    </Switch>
    </BrowserRouter>
);

export default Routes;
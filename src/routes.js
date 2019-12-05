import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import NotFound from './components/NotFound/NotFound';
import Dashboard from './components/Dashboard/Dashboard';
import LogIn from './components/Login/Login'

const Routes = () => (
    <BrowserRouter >
    <Switch>
        <Route exact path='/kostoumart-dashboard' component={Dashboard}/>
        <Route exact path="/welcome" component={Welcome}/>
        <Route exact path="/login" component={LogIn}/>
        <Route path="*" component={NotFound}/>
    </Switch>
    </BrowserRouter>
);

export default Routes;
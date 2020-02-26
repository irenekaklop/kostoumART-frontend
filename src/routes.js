import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import NotFound from './components/Shared/Error/NotFound/NotFound';
import Dashboard from './components/Dashboard/Dashboard';
import Auth from './components/Auth/Auth';
import InternalServer from './components/Shared/Error/InternalServer/InternalServer'

import TPform from './components/Forms/TpForm.js';
import CostumeForm from './components/Forms/CostumeForm.js';

import Test from './components/Shared/test.js';

const Routes = () => (
    <BrowserRouter basename="/kostoumart">
    <Switch>
        <Route path='/kostoumart-dashboard' component={Dashboard}/>
        <Route path="/welcome" component={Welcome}/>
        <Route path="/auth" component={Auth}/>
        <Route path="/addCostume" component={CostumeForm}/>
        <Route path="/test" component={Test}/>
        <Route path="/500" component={InternalServer} />
        <Route path="*" component={NotFound}/>
       
    </Switch>
    </BrowserRouter>
);

export default Routes;
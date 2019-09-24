import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import NotFound from './components/NotFound/NotFound';
import InsertCostume from './components/InsertCostume/InsertCostume';
import SuccessInsert from './components/SuccessInsert/SuccessInsert';
import Suggestions from './components/Autocomplete/Autocomplete';
import DisplayCostumes from './components/DisplayCostumes/DisplayCostumes';

const Routes = () => (
    <BrowserRouter >
    <Switch>
    <Route exact path="/" component={Welcome}/>
    <Route exact path="/insertCostume" component={InsertCostume}/>
    <Route exact path="/success" component={SuccessInsert}/>
    <Route exact path="/displayCostumes" component = {DisplayCostumes}/>
    <Route exact path="/suggestions" component = {Suggestions}/>
    <Route path="*" component={NotFound}/>
    </Switch>
    </BrowserRouter>
);

export default Routes;
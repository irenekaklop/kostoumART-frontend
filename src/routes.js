import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import NotFound from './components/NotFound/NotFound';
import InsertCostume from './components/Insert/InsertCostume';
import SuccessInsert from './components/SuccessInsert/SuccessInsert';
import Suggestions from './components/Autocomplete/Autocomplete';
import DisplayCostumes from './components/Display/DisplayCostumes';
import Geosuggest from './components/Geosuggest/Geosuggest';
import InsertUse from './components/Insert/InsertUse';
import InsertTP from './components/Insert/InsertTP';
import DisplayUses from './components/Display/DisplayUses';
import DisplayTPs from './components/Display/DisplayTP';


const Routes = () => (
    <BrowserRouter >
    <Switch>
    <Route exact path="/kostoumart-dashboard" component={Welcome}/>
    <Route exact path='/insert' component={InsertCostume}/>
    <Route exact path='/geo' component = {Geosuggest}/>
    <Route exact path="*/insert/costume" component={InsertCostume}/>
    <Route exact path = "*/insert/use" component={InsertUse}/>
    <Route exact path = "*/insert/theatrical_play" component={InsertTP}/>
    <Route exact path="/success" component={SuccessInsert}/>
    <Route exact path="/display" component = {DisplayCostumes}/>
    <Route exact path="/display/costumes" component = {DisplayCostumes}/>
    <Route exact path='/display/uses' component = {DisplayUses}/>
    <Route exact path='/display/tps' component = {DisplayTPs}/>
    <Route exact path="/suggestions" component = {Suggestions}/>
    <Route path="*" component={NotFound}/>
    </Switch>
    </BrowserRouter>
);

export default Routes;
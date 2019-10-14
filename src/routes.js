import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import NotFound from './components/NotFound/NotFound';
import InsertCostume from './components/InsertCostume/InsertCostume';
import SuccessInsert from './components/SuccessInsert/SuccessInsert';
import Suggestions from './components/Autocomplete/Autocomplete';
import DisplayCostumes from './components/DisplayCostumes/DisplayCostumes';
import BoundedInput from './components/BoundedInput/BoundedInput';
import Insert from './components/Insert/Insert';
import Geosuggest from './components/Geosuggest/Geosuggest';
import InsertUse from './components/InsertUse/InsertUse';
import InsertTP from './components/InsertTP/InsertTP';


const Routes = () => (
    <BrowserRouter >
    <Switch>
    <Route exact path="/" component={Welcome}/>
    <Route exact path='/insert' component={Insert}/>
    <Route exact path='/geo' component = {Geosuggest}/>
    <Route exact path="/insertCostume" component={InsertCostume}/>
    <Route exact path = "/insertUse" component={InsertUse}/>
    <Route exact path = "/insertTP" component={InsertTP}/>
    <Route exact path="/success" component={SuccessInsert}/>
    <Route exact path="/displayCostumes" component = {DisplayCostumes}/>
    <Route exact path="/suggestions" component = {Suggestions}/>
    <Route exact path="/b"component = {BoundedInput}/>
    <Route path="*" component={NotFound}/>
    </Switch>
    </BrowserRouter>
);

export default Routes;
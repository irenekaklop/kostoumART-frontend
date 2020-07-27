import React, {Component} from 'react';
import { connect } from 'react-redux';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import {isAuthenticated, hasJWTToken} from './store/actions/auth';

import Homepage from "./components/Homepage/Homepage";
import Auth from './containers/Auth/Auth';
import ResetPassword from './components/ResetPassword/ResetPassword';
import RegisterUser from "./components/Register/RegisterUser";

import './App.css'

class App extends Component{

  componentDidMount () {
    console.log(this.props)
    if(this.props.isAuthenticated){
      this.props.hasJWTToken();
    }
  }
  
  render(){

    let routes = (
      <Switch>
        <Route path="/register" exact component={RegisterUser}/>
        <Route path="/forgotPassword/:token" exact component={ResetPassword}/>
        <Route path='/auth' component={Auth}/>
        <Redirect from="/" to="/auth"/>
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/kostoumart-dashboard/register" exact component={RegisterUser}/>
          <Route path="/kostoumart-dashboard" exact component={Homepage}/>
          <Redirect from="/" to="/kostoumart-dashboard"/>
        </Switch>
      );
    }

    return(
      <div>
        <BrowserRouter basename="/kostoumart">
          <div className="App">
            {routes}
          </div>
        </BrowserRouter>
      </div>
      
    );
  }
}

const mapStateToProps = () => {
  return {
    isAuthenticated: isAuthenticated()
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hasJWTToken: () => dispatch(hasJWTToken())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
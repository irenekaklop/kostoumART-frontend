import React, {Component} from 'react';
import './App.css'
import Header from './components/Shared/Header';
import Footer from './components/Shared/Footer';
import Routes from './routes';
import {Router, Route, browserHistory, IndexRoute} from 'react-router-dom';


class App extends Component{
  constructor(){
    super();
    this.state={
      appName: "KostoumArt Platform",
      home: false
    }
  }

  render(){
    return(
      <div className="App">
        <Header name={this.state.appName}/>
        <Routes name={this.state.appName}/>
        <Footer/>
      </div>
    );
  }
}

export default App;

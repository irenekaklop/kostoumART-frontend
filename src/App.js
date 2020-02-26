import React, {Component} from 'react';
import './App.css'
import Routes from './routes';

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
      <Routes name={this.state.appName}/>
    );
  }
}

export default App;

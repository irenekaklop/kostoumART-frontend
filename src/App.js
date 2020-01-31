import React, {Component} from 'react';
import './App.css'
import Header from './components/Shared/Header';
import Footer from './components/Shared/Footer';
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
      <div id="Web_1920___1" className="App">
          <Routes name={this.state.appName}/>
      </div>
    );
  }
}

export default App;

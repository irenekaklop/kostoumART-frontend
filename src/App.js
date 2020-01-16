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
          <svg class="Rectangle_1">
                    <rect fill="rgba(242,242,242,1)" id="Rectangle_1" rx="0" ry="0" x="0" y="0" width="1843.697" height="1041.044">
                    </rect>
          </svg>
          <Routes name={this.state.appName}/>
      </div>
    );
  }
}

export default App;

import React, {Component} from 'react';
import './Welcome.css';

class Welcome extends Component{

    render(){
        return(
            <div id="main">
            <h2 id="welcomeText">Welcome to KostumeArt Platform</h2>
            <a href='/insertCostume' className="button">Insert data</a>
            <a href='/displayCostumes' className="button">Costumes Archive</a>
            <a href='/' className="button warning">Delete data</a>
            </div>
        );
    }
}

export default Welcome;
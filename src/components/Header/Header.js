import React, {Component} from 'react';
import './Header.css';
import logo from '../../logo.png'

class Header extends Component{
    render() {
        return(
            <div className="header">
                <div className="row column" id="header">
                    <a className="logo" href='/kostoumart-dashboard'>
                    <img src={logo}/>
                    <h1 id="tit">KostoumART</h1></a>
                </div>
            </div>
           
            
        )
    }
}

export default Header;
import React from 'react';
import logo from '../../logo.png'
import '../../styles/Header.css';
import Vector_Smart_Object from '../../styles/images/Vector_Smart_Object.png'



class Header extends React.Component {

  constructor(props){
    super(props)
    this.state={

    }
  }

  logOut(){
    this.setState(() => {this.props.logOut()})
  }

  render() {
  return (
      <div>
          <img id="Vector_Smart_Object" src={Vector_Smart_Object}/>
          <svg class="Rectangle_2">
            <rect fill="rgba(71,163,163,1)" id="Rectangle_2" rx="0" ry="0" x="0" y="0" width="1458.365" height="112.639">
            </rect>
          </svg>
          <svg class="Rectangle_3_l">
            <linearGradient id="Rectangle_3_l" spreadMethod="pad" x1="0" x2="1" y1="0.5" y2="0.5">
              <stop offset="0" stop-color="#47a3a3" stop-opacity="1"></stop>
              <stop offset="1" stop-color="#231f20" stop-opacity="1"></stop>
            </linearGradient>
            <rect fill="url(#Rectangle_3_l)" id="Rectangle_3_l" rx="0" ry="0" x="0" y="0" width="1843.697" height="112.152">
            </rect>
          </svg>
          <svg class="Rectangle_4_n">
            <linearGradient id="Rectangle_4_n" spreadMethod="pad" x1="0" x2="1" y1="0.5" y2="0.5">
              <stop offset="0" stop-color="#ffde17" stop-opacity="1"></stop>
              <stop offset="1" stop-color="#231f20" stop-opacity="0"></stop>
            </linearGradient>
            <rect fill="url(#Rectangle_4_n)" id="Rectangle_4_n" rx="0" ry="0" x="0" y="0" width="1843.697" height="47.774">
            </rect>
          </svg>
        
          <svg class="Rectangle_9">
          <rect fill="rgba(56,56,56,1)" id="Rectangle_9" rx="0" ry="0" x="0" y="0" width="378.633" height="112.152">
          </rect>
          </svg>
          <div id="LogoutContainer">
            <div id="Logout">
              <p onClick={() => this.logOut()}>Logout</p>
            </div>
          </div>
          <div id="USERNAME">
            <span>USERNAME</span>
          </div>
          <div id="administrator_gmail_com">
            <span>{this.props.email}</span>
          </div>
          <svg class="Line_5" viewBox="0 0 1 66.176">
            <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="1px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Line_5" d="M 0 0 L 0 66.17550659179688">
            </path>
          </svg>
      </div>
    
  );
}
}

export default Header;
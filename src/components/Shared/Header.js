import React from 'react';
import '../../components/Dashboard/Dashboard.css';
import Vector_Smart_Object from '../../styles/images/Vector_Smart_Object.png'

class Header extends React.Component {

  logOut(){
    this.setState(() => {this.props.logOut()})
  }

  render() {
  return (
      <div>
          <img id="Vector_Smart_Object" src={Vector_Smart_Object}/>
          <svg class="Rectangle_3_l">
            <linearGradient id="Rectangle_3_l" spreadMethod="pad" x1="0" x2="1" y1="0.5" y2="0.5">
              <stop offset="0" stop-color="#47a3a3" stop-opacity="1"></stop>
              <stop offset="1" stop-color="#231f20" stop-opacity="1"></stop>
            </linearGradient>
            <rect fill="url(#Rectangle_3_l)" id="Rectangle_3_l" rx="0" ry="0" x="0" y="0" width="1843.697" height="112.152">
            </rect>
          </svg>
         
      </div>
    
  );
}
}

export default Header;
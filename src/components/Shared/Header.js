import React from 'react';
import logo from '../../logo.png'
import '../../styles/Header.css';

class Header extends React.Component {

  render() {
  return (
      <div className="menu">
          <a href='/kostoumart/kostoumart-dashboard' className= "header_link">
              <img src={logo}/></a>
      </div>
  );
}
}

export default Header;
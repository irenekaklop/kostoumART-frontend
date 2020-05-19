import React from 'react';
import { connect } from 'react-redux';
import Vector_Smart_Object from '../../../styles/images/Vector_Smart_Object.png'
import { isAuthenticated, logOut } from "../../../store/actions/auth";
import { Button } from '@material-ui/core';

import "./Header.css";

class Header extends React.Component {
  render() {
    const username = localStorage.getItem('user-name');

    return (
      <div style={{overflow:'hidden'}}>
        <img src={Vector_Smart_Object}/>
        <div className='logout-area'>
          <Button id="LOGOUT_BUTTON" onClick={this.props.logOut}>Logout</Button>
          <div id="USERNAME"><span>USERNAME</span></div>
          <div id="administrator_email">
            <span>{username}</span>
          </div>
          <svg class="Line_5" viewBox="0 0 1 66.176">
            <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="1px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Line_5" d="M 0 0 L 0 66.17550659179688">
            </path>
          </svg>

          </div>
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
    logOut: () => dispatch(logOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
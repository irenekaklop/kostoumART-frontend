import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import {NotificationContainer, NotificationManager} from 'react-notifications';
import { IconButton } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Auth.css';

import { logIn, isAuthenticated } from "../../store/actions/auth";


class Auth extends Component {

    state = {
        controls: {
            email: {
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    isEmail: true
                }
            },
            password: {
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 3
                }
            }
        },
        isSignup: true
    }

    resetState = () => {
        this.setState({
            controls: {
                email: {
                    value: '',
                    valid: false,
                    touched: false,
                    validation: {
                        required: true,
                        isEmail: true
                    }
                },
                password: {
                    value: '',
                    valid: false,
                    touched: false,
                    validation: {
                        required: true,
                        minLength: 3
                    }
                }
            },
            isSignup: true
        })
    }

    checkValidity ( value, rules ) {
        let isValid = true;
        if ( !rules ) {
            return true;
        }

        if ( rules.required ) {
            isValid = value.trim() !== '' && isValid;
        }

        if ( rules.minLength ) {
            isValid = value.length >= rules.minLength && isValid
        }


        if ( rules.isEmail ) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test( value ) && isValid
        }

        return isValid;
    }

    inputChangedHandler = (inputField) => event => {
        let updatedControls = {...this.state.controls};
        updatedControls[inputField].value = event.target.value;
        updatedControls[inputField].valid = event.target.value.length > 2;
        updatedControls[inputField].touched = true;

        this.setState({
            controls: updatedControls
        });
    }

    submitHandler = (event) => {
        event.preventDefault();
        let userData ={
            email: this.state.controls.email.value,
            password: this.state.controls.password.value
        }
        this.props.onAuth(userData);
    }
    
    createNotification(type){
        switch (type) {
            case "error-login":
                return(
                    <div>
                        <NotificationContainer>{ NotificationManager.error('Ο κωδικός ή το όνομα χρήστη είναι λανθασμένα') }</NotificationContainer>
                    </div>
                )
            case "login":
                return(
                    <NotificationContainer>{ NotificationManager.success('Η εγγραφή διαγράφηκε','Success!',2000) }</NotificationContainer>
                )
        };
    }

    render(){
        if (this.props.controlsError) {
            this.createNotification('error-login');
        }
        if (this.props.isAuthenticated) {
            return (
              <Redirect to='/kostoumart-dashboard'/>
            );
        }

        return(
            <div>
                <img src={require("../../styles/images/INTRO-IMAGE-3.png")}/>
                <NotificationContainer></NotificationContainer>
                <div id="costumART">
                    <span>costumART</span>
	            </div>
                <div id="WELCOME">
                    <span>WELCOME</span>
                </div>
                <svg class="Path_1" viewBox="-2092.015 -755.617 1920 602.09">
                    <path fill="rgba(56,56,56,1)" id="Path_1" d="M -172.0152282714844 -153.5272369384766 L -2092.01513671875 -153.5272369384766 L -2092.01513671875 -755.616943359375 L -172.0152282714844 -511.7850341796875 L -172.0152282714844 -153.5272369384766 Z">
                    </path>
                </svg>
                <div id="in_tailored_times">
                    <span>in tailored times</span>
                </div>
                <div id="LOGIN">
                    <span>LOGIN</span>
                </div>
                <form onSubmit={this.submitHandler}>
                    <div id="EMAIL">
                        <span>EMAIL</span>
                    </div>
                    <input
                        id="EmailInput"
                        type='email'
                        value={this.state.controls.email.value}
                        onChange={this.inputChangedHandler('email')}
                        autoComplete='email'
                    />       
                    <div id="PASSWORD">
                        <span>PASSWORD</span>
                    </div>
                    <input
                        id="PasswordInput"
                        type='password'
                        value={this.state.controls.password.value}
                        onChange={this.inputChangedHandler('password') }
                        autoComplete='password'
                    />    
                </form>
                <IconButton id="BUTTON" onClick={this.submitHandler}><img src={require('../../styles/images/ROUND_BTN.png')}/></IconButton>
                <svg class="Line_3" viewBox="0 0 1924.593 1">
                    <path fill="transparent" stroke="rgba(255,222,23,1)" stroke-width="1px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Line_3" d="M 0 0 L 1924.592529296875 0">
                    </path>
                </svg>
                <svg class="Line_6" viewBox="0 0 798.843 0.75">
                    <path fill="transparent" stroke="rgba(255,222,23,1)" stroke-width="0.75px" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="5 8" stroke-dashoffset="0" stroke-miterlimit="4" shape-rendering="auto" id="Line_6" d="M 0 0 L 798.8427734375 0">
                    </path>
                </svg>
                <svg class="Rectangle_4">
                    <rect fill="rgba(255,222,23,1)" id="Rectangle_4" rx="0" ry="0" x="0" y="0" width="798.843" height="36.461">
                </rect>
            </svg>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.loading,
        controlsError: state.error,
        controlsErrorCode: state.code,
        isAuthenticated: isAuthenticated()
    };
  };
  
const mapDispatchToProps = dispatch => {
    return {
      onAuth: (data) => dispatch(logIn(data))
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
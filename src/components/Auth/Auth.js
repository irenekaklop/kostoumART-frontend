import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import {NotificationContainer, NotificationManager} from 'react-notifications';

import { login } from './UserFunctions.js'
import './Auth.css'
import axios from 'axios';

class Auth extends Component{

    constructor(props){
        super(props);
        this.state = {
            users: [],
            email: '',
            password: '',
            role: '',
            errors: {},
            redirectToReferrer: false            

        }
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        
    }

    onChange = ( evt ) => { 
        this.setState({ [evt.target.name]: evt.target.value }); 
        console.log(this.state)
    };

    resetForm(){
        this.setState({
            email: '',
            password: '',
            role: '',
        });
    }

    createNotification(type){
        switch (type) {
            case "error-login":
                return(
                    <div>
                        <NotificationContainer>{ NotificationManager.error('Ο κωδικός ή το όνομα χρήστη είναι λανθασμένα') }</NotificationContainer>
                    </div>
                )
            case "error-password":
                return(
                    <div>
                        <NotificationContainer>{ NotificationManager.error('Ο κωδικός είναι λανθασμένα') }</NotificationContainer>
                    </div>
                )    
            case "login":
                return(
                    <NotificationContainer>{ NotificationManager.success('Η εγγραφή διαγράφηκε','Success!',2000) }</NotificationContainer>
                )
        };
    }


    handleSubmit = (e) => {
        e.preventDefault()

        const user = {
            email: this.state.email,
            password: this.state.password
        }

        login(user).then(res => {
        if (res) {
            console.log(res);
            switch(res.status){
                case 401: 
                    this.createNotification("error-login");
                    this.resetForm();
                    return;
                case 400:
                    this.createNotification("error-password");
                    this.resetForm();
                    return;
                case 200:
                    this.props.history.push(`/kostoumart-dashboard`)
                    return;
                default:
                    return;
            }
        }
        })
    }

    render(){
        const {email, password, redirectToReferrer} = this.state;

        if (redirectToReferrer === true) {
            return <Redirect to="/kostoumart-dashboard" />
        }
        return(
            <div id="Web_1920___1">
                <NotificationContainer></NotificationContainer>
                <img src={require("../../styles/images/INTRO-IMAGE-3.png")}/>
                <div id="WELCOME">
                    <span>WELCOME</span>
                </div>
                <svg class="Path_1" viewBox="-2092.015 -755.617 1920 602.09">
                    <path fill="rgba(56,56,56,1)" id="Path_1" d="M -172.0152282714844 -153.5272369384766 L -2092.01513671875 -153.5272369384766 L -2092.01513671875 -755.616943359375 L -172.0152282714844 -511.7850341796875 L -172.0152282714844 -153.5272369384766 Z">
                    </path>
                </svg>
                <div id="costumART">
                <span>costumART</span>
	            </div>
                <div id="in_tailored_times">
                    <span>in tailored times</span>
                </div>
                <div id="LOGIN">
                    <span>LOGIN</span>
                </div>
                <div id="EMAIL">
                    <span>EMAIL</span>
                </div>
                <input
                    id="EmailInput"
                    type='text'
                    value={email}
                    name="email"
                    onChange={this.onChange}
                    required={true}
                />            
                <div id="PASSWORD">
                    <span>PASSWORD</span>
                </div>
                <input
                    id="PasswordInput"
                    name="password"
                    type='password'
                    value={password}
                    onChange={this.onChange}
                    required={true}
                />    
                <button id="BUTTON">
                    <img src={require('../../styles/images/ROUND_BTN.png')} onClick={this.handleSubmit} />
                </button>
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
        )
    }
}

export default Auth;

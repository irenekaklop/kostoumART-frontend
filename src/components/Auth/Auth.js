import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import {TextField, Button, FormControl, Input} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {NotificationContainer, NotificationManager} from 'react-notifications';

import { login } from './UserFunctions.js'
import './Auth.css'

const useStyles = makeStyles(theme => ({
    root: {
        '& label.Mui-focused': {
            color: 'green',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'green',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'red',
            },
            '&:hover fieldset': {
              borderColor: 'yellow',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'green',
            },
          },
    }
}));

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
                <svg class="Rectangle_3_k">
                    <linearGradient id="Rectangle_3_k" spreadMethod="pad" x1="0.636" x2="0.466" y1="-0.182" y2="0.673">
                        <stop offset="0" stop-color="#fff" stop-opacity="1"></stop>
                        <stop offset="1" stop-color="#395d59" stop-opacity="1"></stop>
                    </linearGradient>
                    <rect fill="url(#Rectangle_3_k)" id="Rectangle_3_k" rx="0" ry="0" x="0" y="0" width="1920" height="834.399">
                    </rect>
                </svg>
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
                <Input
                classes={{root: 'email_input'}}
                value={email}
                name="email"
                onChange={this.onChange}
                />
                <div id="USERNAME">
                    <span>USERNAME</span>
                </div>
                <div id="PASSWORD">
                    <span>PASSWORD</span>
                </div>
                <div id="Group_3">
                    <button onClick={this.handleSubmit}>
                    <div id="Group_2">
                    <svg class="Path_2" viewBox="-1486.308 -340.855 4.67 9.609">
                        <path fill="rgba(0,0,0,0)" stroke="rgba(255,222,23,1)" stroke-width="0.7658530473709106px" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" shape-rendering="auto" id="Path_2" d="M -1486.3076171875 -340.8554382324219 L -1481.637817382812 -336.0059509277344 L -1486.3076171875 -331.2462768554688">
                        </path>
                    </svg>
                    <svg class="Ellipse_1">
                        <ellipse fill="rgba(0,0,0,0)" stroke="rgba(255,222,23,1)" stroke-width="0.7658530473709106px" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" shape-rendering="auto" id="Ellipse_1" rx="21.769573211669922" ry="21.769573211669922" cx="21.769573211669922" cy="21.769573211669922">
                        </ellipse>
                    </svg>
                    </div>
                </button>
                </div>
               
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

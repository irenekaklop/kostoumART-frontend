import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import {TextField, Button, FormControl, Input} from '@material-ui/core';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import { login } from './UserFunctions.js'
import './Auth.css'

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
            <div className='LogInForm'>
                <NotificationContainer></NotificationContainer>
                <div className="FormTitle">Σύνδεση</div>
                <FormControl className="FormControl">
                    <TextField
                    label="Email"
                    value={email}
                    name="email"
                    onChange={this.onChange}
                    margin="none"
                    required={true}
                    inputProps={{style: { fontSize: 14 }}}
                    />
                </FormControl>
                <br/>
                <FormControl className="FormControl">
                    <TextField
                    label="Κωδικός"
                    name="password"
                    type='password'
                    value={password}
                    onChange={this.onChange}
                    required={true}/>
                </FormControl>
                <br/>
                <Button color="primary" onClick={this.handleSubmit}>Login</Button>
            </div>
        )
    }
}

export default Auth;

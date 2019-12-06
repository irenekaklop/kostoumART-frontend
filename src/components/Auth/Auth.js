import React, { Component } from 'react';

import {TextField, Button, FormControl, Input} from '@material-ui/core';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import './Auth.css';
import axios from 'axios';

class Auth extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: {
                value: '',
                valid: false,
                touched: false
            },
            password: {
                value: '',
                valid: false,
                touched: false
            }
        }
    }

    componentDidMount(){
        this.get_users();
    }

    get_users = _ => {
        //axios.get('http://88.197.53.80/kostoumart-api/users')
        axios.get("http://localhost:8108/users")
        .then(res => {
            const users = res.data.response;
            this.setState({ users });
        }
        )
    }

    handleChange = (element) => event => {
        let updatedState = {...this.state};
        updatedState[element].touched = true;
        updatedState[element].value = event.target.value;
        updatedState[element].valid = event.target.value.length > 0;
        //updatedState[element].valid = this.checkValidity(event.target.value)
        this.setState(updatedState);
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value);
    }

    resetForm(){
        this.setState({
            name: '',
            password: '',
            role: '',
        });
    }

    logInUser = (event) => {
        event.preventDefault();

        let user_data = {
            email: this.state.email.value,
            password: this.state.password.value
        }

        axios.post('http://localhost:8108/login', user_data)
        .then((response) => {
            console.log("Response", response)
            this.createNotification('login');
        },
        (error) => {
            this.createNotification('error-login');
            console.log(error.response);
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
            case "login":
                return(
                    <NotificationContainer>{ NotificationManager.success('Η εγγραφή διαγράφηκε','Success!',2000) }</NotificationContainer>
                )
        };
    }


    render () {
        const {email, password} = this.state;
        return(
            <div className='LogInForm'>
                <NotificationContainer></NotificationContainer>
                <div className="FormTitle">Σύνδεση</div>
                <FormControl className="FormControl">
                    <TextField
                    label="Όνομα"
                    value={email.value}
                    name="email"
                    onChange={this.handleChange('email')}
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
                    value={password.value}
                    onChange={this.handleChange('password')}
                    required={true}/>
                </FormControl>
                <br/>
                <Button color="primary" onClick={this.logInUser}>Login</Button>
            </div>
        )
    }
}

export default Auth;
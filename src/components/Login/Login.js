import React, {Component} from 'react';

import {TextField, Button, FormControl, Input} from '@material-ui/core';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import './Login.css'
import axios from 'axios';

class Login extends Component{

    constructor(props){
        super(props);
        this.state = {
            users: [],
            name: '',
            password: '',
            role: '',
        }
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount(){
        this.get_users();
    }

    onChange = ( evt ) => { 
        this.setState({ [evt.target.name]: evt.target.value }); 
        console.log(this.state)
    };

    get_users = _ => {
        axios.get('http://88.197.53.80/kostoumart-api/users')
        //axios.get("http://localhost:8108/users")
        .then(res => {
            const users = res.data.response;
            this.setState({ users });
        }
        )
    }

    validateLogin(){
        for(var i=0; i<this.state.users.length; i++){
            if(this.state.name === this.state.users[i].username){
                if(this.state.password === this.state.users[i].password){
                    return true;
                }
                else{
                    this.createNotification('error-login');
                    this.resetForm();
                    
                }
            }
        }
        return false;
    }
    
    resetForm(){
        this.setState({
            name: '',
            password: '',
            role: '',
        });
        this.get_users();
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
                    <NotificationContainer>{ NotificationManager.success('Login','Success!',2000) }</NotificationContainer>
                )
        };
    }

    handleSubmit = () => {
        if(this.validateLogin()){
            this.createNotification("login");
        }
    }

    render(){
        const {name, password} = this.state;
        return(
            <div className='LogInForm'>
                <NotificationContainer></NotificationContainer>
                <div className="FormTitle">Σύνδεση</div>
                <FormControl className="FormControl">
                    <TextField
                    label="Όνομα"
                    value={name}
                    name="name"
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

export default Login;
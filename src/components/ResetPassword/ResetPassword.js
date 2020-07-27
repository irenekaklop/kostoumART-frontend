import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import axios from '../../utils/api-url';
import './ResetPassword.css';
import { Link } from 'react-router-dom';

class ResetPassword extends Component {

  state = {
    email: {
      value: '',
      valid: false,
    },
    password: {
      value: '',
      valid: false,
    },
    confirm: {
      value: '',
      valid: false,
    },
    update: false,
    isLoading: false,
    hasError: false,
    tokenExpired: false
  };

  componentDidMount() {
    axios.instance.get('/reset', {
      params: {
        resetPasswordToken: this.props.match.params.token
      }
    })
    .then(response => {
      if(response.data.message === 'password reset link ok'){
        let updatedState = {...this.state};
        updatedState['email'].value = response.data.email;
        updatedState['email'].valid = true;
        this.setState(updatedState);
        this.setState({isLoading: false});
      }
      else{
        console.log(response);
        this.setState({
          hasError: true
        })
      }
    })
    .catch(error => {
      console.log(error);
      this.setState({
        tokenExpired: true
      })
    })
  }

  handleChange = (element) => event => {
    let updatedState = {...this.state};
    updatedState[element].value = event.target.value;
    updatedState[element].valid = event.target.value.length > 0;

    if (element === 'password' || element === 'confirm') {
      updatedState.confirm.valid = event.target.value.length > 0 
        && updatedState.password.value === updatedState.confirm.value;
    }

    this.setState(updatedState);
  };

  changePassword = (event) => {
    event.preventDefault();

    let userData = {
      email: this.state.email.value,
      password: this.state.password.value
    };

    if (this.state.password.valid && this.state.confirm.valid) {
        axios.instance.post('/updatePassword', userData)
        .then((response) => {
          console.log(response.statusText)
          let ret=this.createNotification('reset-ok');
          return ret;
        },
        (error) => {
          console.log(error.response);
          let ret=this.createNotification('reset-fail');
          return ret;
        });
    }
    else{
      let ret=this.createNotification('password-fail');
      return ret;
    }
  };

  createNotification(type){
    switch (type) {
      case "reset-ok":
        return(
          <NotificationContainer>{ NotificationManager.success('Ο κωδικός άλλαξε','Success!',2000) }</NotificationContainer>
        )
      case "reset-fail":
        return(
          <NotificationContainer>{ NotificationManager.error('Κάτι πήγε λάθος, το mail αυτό δεν υπάρχει') }</NotificationContainer>
        )
      case "email-not-exists":
        return(
          <NotificationContainer>{ NotificationManager.error('Το mail αυτό δεν υπάρχει') }</NotificationContainer>
        )
      case "password-fail":
        return(
          <NotificationContainer>{ NotificationManager.error('Oι κωδικοί δεν είναι ίδιοι') }</NotificationContainer>
        )
      
    };
}
  
  render() {
    return (
      <React.Fragment>
        <NotificationContainer></NotificationContainer>
        {this.state.tokenExpired &&
          <p>
            Something went wrong...<br/><br/>
            URL is expired!<br/><br/>
            If you still wish to retrieve your password, press <Link to='/auth'>
            here</Link>.
          </p>
        }
        {this.state.hasError &&
          <p>
            Something went wrong...<br/><br/>
            If you still wish to retrieve your password, press <Link to='/auth'>
            here</Link>.
          </p>
        }
        {!this.state.tokenExpired && !this.state.hasError &&
            <React.Fragment>

            <div className="ResetTitle">Reset Password</div>
            <form className="ResetPasswordForm" onSubmit={this.changePassword}> 
                <TextField
                    label="Email"
                    value={this.state.email.value}
                    onChange={this.handleChange('email')}
                    margin="normal"
                    required={true}
                />

                <br/>
                  
                <TextField
                    label="New Password"
                    value={this.state.password.value}
                    onChange={this.handleChange('password')}
                    margin="normal"
                    required={true}
                    type='password'
                  />
                <br/>
                <TextField
                    label="Confirm Password"
                    value={this.state.confirm.value}
                    onChange={this.handleChange('confirm')}
                    margin="normal"
                    required={true} 
                    type='password'
                />
                <br/><br/><br/>
                <Button 
                  type="submit" 
                  style={{background: 'yellow'}}
                >
                  Submit
                </Button>
                {this.state.hasError && 
                  <p className="LogInError">Something went wrong...</p>}  
            </form>
            </React.Fragment>
        }
      </React.Fragment>
    )
  }
}

export default ResetPassword;

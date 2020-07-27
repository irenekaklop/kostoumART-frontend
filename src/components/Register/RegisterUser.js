import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import {NotificationContainer, NotificationManager} from 'react-notifications';

import axios from '../../utils/api-url';

const options = [
    {
      value: '1',
      label: 'Admin',
    },
    {
      value: '0',
      label: 'Editor',
    },
];
  
class RegisterUser extends Component {
  
  state = {
    username: {
      value: '',
      valid: false,
    },
    email: {
      value: '',
      valid: false,
    },
    password: {
      value: '',
      valid: false,
    },
    role: {
      value: '',
      valid: false,
    },
  };

  handleChange = (element) => event => {
    let updatedState = {...this.state};
    updatedState[element].value = event.target.value;
    updatedState[element].valid = event.target.value.length > 0;

    this.setState(updatedState);
  };

  createNotification(type){
    switch (type) {
      case "signup-ok":
        return(
          <NotificationContainer>{ NotificationManager.success('O χρήστης καταχωρήθηκε με επιτυχία','Success!',2000) }</NotificationContainer>
        )
      case "signup-fail":
        return(
          <NotificationContainer>{ NotificationManager.error('Κάποιο πρόβλημα παρουσιάστηκε') }</NotificationContainer>
        )
      case "user-duplicate":
        return(
          <NotificationContainer>{ NotificationManager.error('Υπάρχει χρήστης με αύτό το email') }</NotificationContainer>
        )
    }
  }
  
  handleSubmit = (event) => {
    event.preventDefault();

    let userData = {
      email: this.state.email.value,
      password: this.state.password.value,
      username: this.state.username.value,
      role: this.state.role.value
    };

    axios.instance.post('/register', userData)
    .then((response) => {
      if(response.statusText==='OK'){
        let ret=this.createNotification('signup-ok');
        return ret;
      }
      else{
        let ret=this.createNotification('signup-fail');
        return ret;
      }
      },
      (error) => {
        console.log(error.response);
        if(error.response.status === 400){
          let ret=this.createNotification('user-duplicate');
          return ret;
        }
        else {
          let ret=this.createNotification('signup-fail');
          return ret;
        }
      }
    )
  }
  
  render() {
    return (
      <React.Fragment>
        <NotificationContainer></NotificationContainer>
        <div style={{fontSize:'150%', marginTop: '3%', marginBottom: '5%'}}>Sign-Up</div>
        <form onSubmit={this.handleSubmit}> 
            <TextField
              style={{width:'15%'}}
              label="Email"
              value={this.state.email.value}
              onChange={this.handleChange('email')}
              margin="normal"
              required={true}
            />
            <br/>
            <TextField
              style={{width:'15%'}}
              label="Username"
              value={this.state.username.value}
              onChange={this.handleChange('username')}
              margin="normal"
              required={true}
            />
            <br/>
            <TextField
              style={{width:'15%'}}
              label="Password"
              value={this.state.password.value}
              onChange={this.handleChange('password')}
              margin="normal"
              required={true}
              type='password'
            />
            <br/>
            <TextField
              style={{width:'15%'}}
              label="Role"
              select
              value={this.state.role.value}
              onChange={this.handleChange('role')}
              margin="normal"
              required={true} 
            >
            {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
            ))}
            </TextField>
            <br/><br/><br/>
            <Button 
              type="submit" 
              style={{background: 'yellow'}}
            >
              Submit
            </Button>
        </form>
      </React.Fragment>
    )
  }
}

export default RegisterUser;

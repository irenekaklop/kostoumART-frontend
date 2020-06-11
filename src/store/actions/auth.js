import * as actionTypes from './actionTypes';
import axios from "axios";
import jwt_decode from 'jwt-decode';

export const authStart = () => {
  return {
      type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token) => {
    return {
      type: actionTypes.AUTH_SUCCESS,
      token: token,
      error: false
    };
  };

export const authFail = () => {
  return {
    type: actionTypes.AUTH_FAIL,
    token: null,
    error: true,
  };
};

export const authReset = () => {
  return{
    type: actionTypes.AUTH_RESET,
  };
};

export const authLogout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
    token: null,
    error: false
  };
};

export const logIn = (data) => {
  return dispatch => {
    dispatch(authStart());
    axios.post('http://localhost:8108/login', data)
    .then((response) => {
      console.log(response)
      localStorage.clear();
      const decoded = jwt_decode(response.data);
      localStorage.setItem('token', response.headers['x-auth']);
      localStorage.setItem('user-name', decoded.username);
      localStorage.setItem('user-type', decoded.role);
      localStorage.setItem('login-time', new Date().getTime());
      dispatch(authSuccess());
    })
    .catch((error) => {
      dispatch(authFail());
    });
  };
};

export const logOut = () => {
  return dispatch => {
    localStorage.clear();
    dispatch(authLogout());
  }
};

export const hasJWTToken = () => {
  return dispatch => {
    var isExpired = false;
    const token = localStorage.getItem('token');
    var decodedToken = jwt_decode(token)
      if(decodedToken.exp < new Date().getTime()/1000){
        console.log('expired')
        isExpired = true;
        localStorage.clear();
        window.location.reload();
        dispatch(authLogout());
      }
      else {
        dispatch(authSuccess());
      }
    };
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
}

export const resetError = () => {
  return dispatch => {
    dispatch(authReset());
  }
}
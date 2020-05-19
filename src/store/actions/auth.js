import * as actionTypes from './actionTypes';
import axios from '../../utils/api-url'
import jwt_decode from 'jwt-decode';

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

export const authLogout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
    token: null,
    error: false
  };
};

export const logIn = (data) => {
    return dispatch => {
        axios.instance.post('login', data)
        .then((response) => {
            localStorage.clear();
            const decoded = jwt_decode(response.data);
            localStorage.setItem('token', response.headers['x-auth']);
            localStorage.setItem('user-name', decoded.username);
            localStorage.setItem('user-type', decoded.role);
            localStorage.setItem('login-time', new Date().getTime());
            dispatch(authSuccess());
            console.log("LocalStorage", localStorage, decoded)
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
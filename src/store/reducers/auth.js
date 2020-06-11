import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    error: null,
    loading: false
};

const authStart = ( state, action ) => {
  return updateObject( state, { 
    error: null, 
    loading: true 
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, { 
    token: action.token,
    error: false,
    loading: false
  });
};
  
const authFail = (state, action) => {
  return updateObject(state, {      
    token: null,
    error: action.error,
    loading: false
  });
};
  
const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
    error: false
  });
};
  
const authReset = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START: return authStart(state, action);
    case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
    case actionTypes.AUTH_FAIL: return authFail(state, action);
    case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
    case actionTypes.AUTH_RESET: return authReset(state, action);
    default:
      return state;
    }
};
  
export default reducer;
  
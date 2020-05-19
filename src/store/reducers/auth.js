import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    error: null,
};

const authSuccess = (state, action) => {
  return updateObject(state, { 
    token: action.token,
    error: false
  });
};
  
const authFail = (state, action) => {
  return updateObject(state, {      
    token: null,
    error: action.error
  });
};
  
const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
    error: false
  });
};
  
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
    case actionTypes.AUTH_FAIL: return authFail(state, action);
    case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
    default:
      return state;
    }
};
  
export default reducer;
  
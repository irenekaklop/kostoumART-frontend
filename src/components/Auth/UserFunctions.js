import axios from '../../utils/api-url.js';

export const login = user => {
  return  axios.instance.post('login', {
      email: user.email,
      password: user.password,
    })
    .then((response) => {
        console.log("Response", response);
        localStorage.setItem('usertoken', response.data)
        return response;
    },
    (error) => {
      console.log("err", error.response)
      return error.response;
    })
}
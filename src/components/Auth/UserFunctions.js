import axios from 'axios'

export const login = user => {
  return axios
    .post('http://88.197.53.80/kostoumart-api/users/login', {
    //.post('http://localhost:8108/users/login', {
      email: user.email,
      password: user.password
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
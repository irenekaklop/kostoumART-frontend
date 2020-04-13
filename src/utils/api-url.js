import axios from 'axios';

//const baseURL = "http://88.197.53.80/kostoumart-api/";
const baseURL = "http://localhost:8108/";

const instance = axios.create({
    baseURL: baseURL,
});

instance.interceptors.request.use((config) => {
    config.headers['Content-Type'] = 'application/json';
    
    console.log(localStorage.getItem('token'))
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  });
  
  export default {baseURL, instance};
import axios from 'axios'


const BASE_URL = process.env.NODE_ENV === 'development'
? `http://localhost:7777/api`
: 'https://arcane-refuge-82130.herokuapp.com/public/api'

axios.defaults.baseURL = BASE_URL;


axios.interceptors.request.use((config) => {
  let token = localStorage.getItem('auth_token');
   config.headers['Authorization'] = `Bearer ${token}`;
   return config;
});

export const AXIOS = axios;


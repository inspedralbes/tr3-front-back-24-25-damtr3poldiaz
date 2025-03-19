import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.56.1:3000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default api;

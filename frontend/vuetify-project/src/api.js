import axios from 'axios';

const api = axios.create({
  baseURL: 'http://gatovsdino.dam.inspedralbes.cat:3000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default api;

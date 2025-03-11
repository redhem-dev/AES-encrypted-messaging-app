import axios from 'axios';

const baseURL = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true 
});

export default baseURL
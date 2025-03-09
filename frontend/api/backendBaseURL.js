import axios from 'axios';

const baseURL = axios.create({
    baseURL: 'http://localhost:3000'
});

export default baseURL
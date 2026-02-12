import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8080/api',
});
client.interceptors.request.use((config) => {
    const userData = localStorage.getItem('user');
    if (userData) {
        const { token } = JSON.parse(userData);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default client;
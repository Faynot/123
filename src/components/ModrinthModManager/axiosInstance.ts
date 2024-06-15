import axios from 'axios';

// Create an axios instance with the necessary headers
const axiosInstance = axios.create({
    baseURL: 'https://api.modrinth.com/v2',
    headers: {
        'User-Agent': 'project_name', // Replace 'project_name' with your project's name
        'X-RateLimit-Limit': 300,
    }
});

// Add a response interceptor to capture X-RateLimit-Remaining
axiosInstance.interceptors.response.use(response => {
    console.log('X-RateLimit-Remaining:', response.headers['x-ratelimit-remaining']);
    return response;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000'
});

// Add the token to the headers
axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;  // Corrected header format
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle role-based errors
axiosInstance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
        if (error.response.status === 403) {
            console.error("Access denied: You do not have permission for this resource.");
            // Optionally, redirect to an "Unauthorized" page
        }
        if (error.response.status === 401) {
            console.error("Session expired: Please log in again.");
            window.location.href = '/login';  // Redirect to login page
        }
    }
    return Promise.reject(error);
});

export default axiosInstance;

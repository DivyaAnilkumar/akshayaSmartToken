import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/'; // Replace with your backend URL

// Register new user
export const register = (formData) => {
    const { name, email, password, role } = formData;
    return axios.post(API_URL + 'register', { name, email, password, role });
};
// Login user
export const login = (email, password) => {
    return axios.post(API_URL + 'login', { email, password })
        .then(response => {
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

// Logout user
export const logout = () => {
    localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

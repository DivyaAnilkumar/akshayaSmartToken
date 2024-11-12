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
            // Check if the response contains a token
            if (response.data.token) {
                // Store the token in localStorage
                localStorage.setItem('token', response.data.token);
                
                // Store the user details in localStorage (store specific user data)
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        });
};

// Logout user
export const logout = () => {
    // Clear token and user data from localStorage on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Get current user (by extracting token and user from localStorage)
export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
        return { token, user }; // Return both token and user details
    }
    return null;
};

// Optionally, check token expiration before making requests
export const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    if (!token) return true;
    
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() > expirationTime;
};


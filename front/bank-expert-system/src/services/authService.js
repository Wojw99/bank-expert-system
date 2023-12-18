// authService.js

import axios from 'axios';
import jwt from 'jsonwebtoken';

const TOKEN_KEY = 'your_token_key';

const authService = {
    async login(username, password) {
        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                username,
                password,
            });

            const { user, token } = response.data;

            // Decode the token if needed (optional, depending on your server-side implementation)
            // const decodedToken = decodeToken(token);

            // Store user data and token in a secure manner (e.g., in Vuex store)
            // Example: store.dispatch('loginUser', { user: decodedToken, token });

            return { user, token };
        } catch (error) {
            console.error('Login failed. Please check your credentials and try again.');
            throw error;
        }
    },

    // Add other authentication-related methods as needed
};


export default {
    login: async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                username,
                password,
            });

            const { token } = response.data;

            // Save token in local storage
            localStorage.setItem(TOKEN_KEY, token);

            return true;
        } catch (error) {
            console.error('Error logging in:', error.message);
            return false;
        }
    },

    logout: () => {
        // Remove token from local storage
        localStorage.removeItem(TOKEN_KEY);
    },

    getToken: () => {
        // Retrieve token from local storage
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated: () => {
        // Check if the token is present and not expired
        const token = localStorage.getItem(TOKEN_KEY);
        return token && !jwt.decode(token).exp;
    },
};

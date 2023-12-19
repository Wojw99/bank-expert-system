// store.js

import { createStore } from 'vuex';

const store = createStore({
    state: {
        user: null,
        authToken: null,
        userRole: null, // Add userRole to the state
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        clearUser(state) {
            state.user = null;
            state.userRole = null; // Clear userRole on logout
        },
        setAuthToken(state, token) {
            state.authToken = token;
        },
        setUserRole(state, role) {
            state.userRole = role;
        },
    },
    actions: {
        async loginUser({ commit }, { user, token, role }) {
            try {
                // Simulating an API call with a delay
                await new Promise((resolve) => setTimeout(() => resolve(), 1000));

                // Set the user, authentication token, and user role in the state
                commit('setUser', user);
                commit('setAuthToken', token);
                commit('setUserRole', role);
            } catch (error) {
                console.error('Error logging in:', error.message);
            }
        },
        logoutUser({ commit }) {
            // Perform any necessary actions to log out the user
            commit('clearUser');
            commit('setAuthToken', null); // Clear the authentication token on logout
        },
    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null;
        },
        authToken(state) {
            return state.authToken;
        },
        userRole(state) {
            return state.userRole;
        },
    },
});

export default store;

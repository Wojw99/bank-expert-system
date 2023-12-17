// store.js
import { createStore } from 'vuex';

const store = createStore({
    state: {
        user: null,
        authToken: null, // Add authToken to the state
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        clearUser(state) {
            state.user = null;
        },
        setAuthToken(state, token) {
            state.authToken = token;
        },
    },
    actions: {
        async loginUser({ commit }, { user, token }) {
            try {
                // Simulating an API call with a delay
                await new Promise((resolve) => setTimeout(() => resolve(), 1000));

                // Set the user and authentication token in the state
                commit('setUser', user);
                commit('setAuthToken', token);
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
    },
});

export default store;

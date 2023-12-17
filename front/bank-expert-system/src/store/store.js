// store.js
import { createStore } from 'vuex';

const store = createStore({
    state: {
        user: null,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        clearUser(state) {
            state.user = null;
        },
    },
    actions: {
        async loginUser({ commit }, user) {
            // Perform any necessary actions to log in the user
            // Simulating an API call with a delay
            await new Promise((resolve) => setTimeout(() => resolve(), 1000));

            commit('setUser', user);
        },
        logoutUser({ commit }) {
            // Perform any necessary actions to log out the user
            commit('clearUser');
        },
    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null;
        },
    },
});

export default store;
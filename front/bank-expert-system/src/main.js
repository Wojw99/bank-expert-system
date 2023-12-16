// main.js
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createStore } from 'vuex';
import App from './App.vue';
import HomeView from './views/HomeView.vue';
import SignIn from './views/SignIn.vue';
import Prediction from './views/Prediction.vue';
import Training from './views/Training.vue';
import SignUp from './views/SignUp.vue';

const routes = [
    { path: '/', component: HomeView },
    { path: '/signin', component: SignIn },
    {
        path: '/prediction',
        component: Prediction,
        meta: { requiresAuth: true },
        // Add this meta field to indicate the route requires authentication
    },
    {
        path: '/training',
        component: Training,
        meta: { requiresAuth: true },
    },
    { path: '/signup', component: SignUp },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

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
        loginUser({ commit }, user) {
            // Perform any necessary actions (e.g., API calls) to log in the user
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

router.beforeEach((to, from, next) => {
    // Check if the route requires authentication
    if (to.meta.requiresAuth) {
        // Check if the user is authenticated
        console.log('Is authenticated:', store.getters.isAuthenticated);

        if (!store.getters.isAuthenticated) {
            // If not authenticated, redirect to the login page
            console.log('User is not authenticated. Redirecting to /signin');
            next('/signin');
        } else {
            // If authenticated, proceed to the requested route
            console.log('User is authenticated. Proceeding to the requested route');
            next();
        }
    } else {
        // If the route doesn't require authentication, proceed to the requested route
        console.log('Route does not require authentication. Proceeding to the requested route');
        next();
    }
});

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');

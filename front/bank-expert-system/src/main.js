// main.js

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/store';
import App from './App.vue';
import SignIn from './views/SignIn.vue';
import Prediction from './views/Prediction.vue';
import Training from './views/Training.vue';
import SignUp from './views/SignUp.vue';

const routes = [
    { path: '/', redirect: '/signin' },
    {
        path: '/signin',
        component: SignIn,
        meta: { requiresUnauth: true },
    },
    {
        path: '/prediction',
        component: Prediction,
        meta: { requiresAuth: true },
    },
    {
        path: '/training',
        component: Training,
        meta: {
            requiresAuth: true,
            roles: 'admin',
        },
    },
    { path: '/signup', component: SignUp },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    // Check if the route requires authentication
    if (to.meta.requiresAuth) {
        // Check if the user is authenticated
        const { isAuthenticated, userRole } = store.getters;

        if (!isAuthenticated) {
            // If not authenticated, redirect to the login page
            console.log('User is not authenticated. Redirecting to /signin');
            next('/signin');
        } else {
            // If authenticated, check the user's role
            const requiredRoles = to.meta.roles || [];

            if (requiredRoles.length === 0 || requiredRoles.includes(userRole)) {
                // User has the required role, proceed to the route
                console.log('User is authenticated and has the required role. Proceeding to the requested route');
                next();
            } else {
                // User does not have the required role, redirect or show an error
                console.log('User does not have the required role. Redirecting or showing an error');
                next('/'); // Redirect to the home page for simplicity
            }
        }
    } else if (to.meta.requiresUnauth) {
        // Check if the route requires no authentication (for example, signin page)
        console.log('Route does not require authentication. Proceeding to the requested route');
        next();
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

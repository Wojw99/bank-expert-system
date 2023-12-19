import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import store from '@/store/store'; // Import your Vuex store

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component() {
      return import(/* webpackChunkName: "about" */ '../views/AboutView.vue');
    },
  },
  {
    path: '/training',
    name: 'training',
    component() {
      return import(/* webpackChunkName: "training" */ '../views/Training.vue');
    },
    meta: {
      // Add a meta field specifying the required roles for the Training route
      requiresAuth: true,
      roles: ['admin'], // Only users with the 'admin' role can access this route
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log('Checking authentication and roles...');
  // Check if the route requires authentication
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    // Check if the user is authenticated
    const isAuthenticated = store.getters.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    if (!isAuthenticated) {
      // Redirect to the login page if the user is not authenticated
      next('/signin');
    } else {
      // Check if the user has the required role for the route
      const requiredRoles = to.meta.roles || [];
      console.log('requiredRoles:', requiredRoles);
      
      const userRole = store.getters.userRole;
      console.log('userRole:', userRole);

      if (requiredRoles.length === 0 || requiredRoles.includes(userRole)) {
        // User has the required role, proceed to the route
        next();
      } else {
        // User does not have the required role, redirect to a different page or show an error
        next('/'); // Redirect to the home page for simplicity
      }
    }
  } else {
    // If the route does not require authentication, proceed
    next();
  }
});


export default router;

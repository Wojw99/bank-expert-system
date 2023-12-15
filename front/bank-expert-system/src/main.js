import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import HomeView from './views/HomeView.vue';
import Login from './views/Login.vue';
import Prediction from './views/Prediction.vue';
import Training from './views/Training.vue';

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: Login },
    { path: '/prediction', component: Prediction },
    { path: '/training', component: Training },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);

app.use(router);

app.mount('#app');

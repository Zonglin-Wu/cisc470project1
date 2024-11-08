import { createRouter, createWebHistory } from 'vue-router';
import store from './store'; // Make sure this points to your Vuex store
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Dashboard from './views/Dashboard.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: { requiresAuth: true } // Mark this route as requiring authentication
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Add navigation guard to check for authentication
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!store.state.token; // Check if the token exists in the Vuex store

    if (to.meta.requiresAuth && !isAuthenticated) {
        // Redirect to login if trying to access a protected route without being authenticated
        store.commit('setErrorMessage', 'Please log in to access the dashboard.');
        next('/login');
    } else {
        next(); // Allow access if authenticated or the route doesn't require authentication
    }
});

export default router;

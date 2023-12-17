<!-- TopMenu.vue -->
<template>
    <div>
        <nav>
            <router-link
            v-if="!$store.getters.isAuthenticated && !requiresUnauth"
            to="/">Home</router-link>
            <router-link
            v-if="!$store.getters.isAuthenticated"
            to="/signin">Sign In</router-link>
            <router-link
            v-if="$store.getters.isAuthenticated"
            to="/prediction">Prediction</router-link>
            <router-link
            v-if="$store.getters.isAuthenticated"
            to="/training">Training</router-link>

            <!-- Logout button -->
            <button v-if="$store.getters.isAuthenticated" @click="logout">Log Out</button>
        </nav>
    </div>
</template>

<script>
export default {
    methods: {
        logout() {
            // Dispatch the logoutUser action to log out the user
            this.$store.dispatch('logoutUser');

            // Redirect to the home page after logout (adjust the route as needed)
            this.$router.push('/');
        },
    },
    computed: {
        requiresUnauth() {
            return this.$route.meta.requiresUnauth;
        },
    },
};
</script>

<style lang="scss">
nav {
    display: flex;
    justify-content: space-between;
    /* Space between items, pushing "Log Out" to the right */
    align-items: center;
    padding: 30px;
}

a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    margin: 0 10px;

    &.router-link-exact-active {
        color: #42b983;
    }

    button {
        margin-left: 10px;
    }
}
</style>

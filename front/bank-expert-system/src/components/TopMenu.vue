<template>
    <div>
        <nav>
            <!-- Navigation items container -->
            <div class="navigation-container">
                <router-link to="/">Home</router-link>
                <router-link to="/signin">Sign In</router-link>
                <router-link to="/prediction">Prediction</router-link>
                <router-link to="/training">Training</router-link>
            </div>

            <!-- Logout button -->
            <div role="button"
            tabindex="0" class="logout"
            v-if="$store.getters.isAuthenticated" @click="logout"
                @keydown.enter="logout">
                Log Out
            </div>
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
};
</script>

<style lang="scss">
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
}

.navigation-container {
    display: flex;
    align-items: center;
}

a,
.logout {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    cursor: pointer;
    margin: 0 10px;
    padding: 8px 12px;
    /* Add padding for a framed appearance */
    border: 1px solid #ccc;
    /* Add a light border */
    border-radius: 4px;
    /* Add border-radius for rounded corners */

    &:hover {
        text-decoration: underline;
        background-color: #f0f0f0;
        /* Add a light background color on hover */
    }

    &.router-link-exact-active {
        color: #42b983;
        background-color: #e0e0e0;
        /* Add a slightly darker background color for active state */
    }
}

.logout {
    margin-left: auto;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
}</style>

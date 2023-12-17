<template>
  <div :style="{ width: '100%', height: '100vh' }">
    <h1>Sign In</h1>

    <div id="datesContainer">
      <!-- Check if the user is authenticated -->
      <template v-if="!$store.getters.isAuthenticated">
        <!-- Sign-in form -->
        <form @submit.prevent="signIn">
          <label for="login">
            <span>Login</span>
            <input name="login" id="login" v-model="login" @keyup.enter="signIn" />
          </label>
          <br>
          <label for="password">
            <span>Password</span>
            <input :type="showPassword ? 'text' : 'password'"
            name="password" id="password" v-model="password"
              @keyup.enter="signIn" />
            <label for="showPassword">
              <input type="checkbox" v-model="showPassword" />
              <span>Show Password</span>
            </label>
          </label>
          <br>
          <button type="submit">Log In</button>
        </form>
        <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

        <div>
          <p>Don't have an account?</p>
          <router-link to="/signup" class="login-link">Sign Up</router-link>
        </div>
      </template>

      <!-- User panel -->
      <template v-else>
        <div class="user-panel">
          <!-- <p>Welcome, {{ $store.state.user.username }}</p> -->
          <!-- Add any additional user-related content or actions here -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import store from '@/store/store';
import axios from 'axios';

export default {
  name: 'SignInPanel',
  data() {
    return {
      login: '',
      password: '',
      showPassword: false,
      errorMessage: '',
    };
  },
  beforeRouteEnter(to, from, next) {
    // Check if the user is authenticated
    const { getters } = store;
    const { isAuthenticated } = getters;

    // If authenticated, redirect to the prediction page
    if (isAuthenticated) {
      next('/prediction');
    } else {
      // If not authenticated, proceed with entering the sign-in page
      next();
    }
  },

  beforeRouteLeave(to, from, next) {
    // Check if the user is authenticated
    const { getters } = store;
    const { isAuthenticated } = getters;

    // If authenticated, proceed with leaving the route
    if (isAuthenticated) {
      next();
    } else {
      // If not authenticated, proceed with leaving the route
      next();
    }
  },
  methods: {
    async signIn() {
      try {
        const response = await axios.post(
          'http://localhost:3000/auth/login',
          {
            username: this.login,
            password: this.password,
          },
        );

        const { user, token } = response.data;

        // Dispatch the loginUser action with the signed-in user data and token
        await this.$store.dispatch('loginUser', { user, token });

        // Check if the user is authenticated after successful login
        if (this.$store.getters.isAuthenticated) {
          // Redirect to the prediction page
          this.$router.push('/prediction');
        } else {
          // Handle the case where authentication didn't succeed
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
        }
      } catch (error) {
        console.error('Error:', error.message);

        // Update errorMessage to show the error message to the user
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.login-link {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>

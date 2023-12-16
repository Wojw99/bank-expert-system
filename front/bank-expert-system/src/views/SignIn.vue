<template>
  <div :style="{ width: '100%', height: '100vh' }">
    <h1>Sign In</h1>

    <div id="datesContainer">
      <form @submit.prevent="signIn">
        <label for="login">
          <span>Login</span>
          <input name="login" id="login" v-model="login" @keyup.enter="signIn" />
        </label>
        <br>
        <label for="password">
          <span>Password</span>
          <input
            :type="showPassword ? 'text' : 'password'"
            name="password"
            id="password"
            v-model="password"
            @keyup.enter="signIn"
          />
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
    </div>
  </div>
</template>

<script>
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

        // Dispatch the loginUser action with the signed-in user data
        this.$store.dispatch('loginUser', response.data);

        // Redirect to the prediction page after successful login
        this.$router.push('/prediction');
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

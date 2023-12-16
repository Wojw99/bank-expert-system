<template>
  <div :style="{ width: '100%', height: '100vh' }">
    <h1>Sign In</h1>

    <div id="datesContainer">
      <form @submit.prevent="SignIn">
        <label for="login">
          Login <input name="login" id="login" v-model="login" @keyup.enter="SignIn" />
        </label>
        <br>
        <label for="password">
          Password
          <input
            type="password"
            name="password"
            id="password"
            v-model="password"
            @keyup.enter="SignIn"
          />
        </label>
        <br>
        <button type="submit">Log In</button>
      </form>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

      <div>
        <p>Don't have an account?</p>
        <router-link to="/signup">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPanel',
  data() {
    return {
      login: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async SignIn() {
      try {
        const response = await axios.post(
          'http://localhost:3000/auth/login',
          {
            username: this.login,
            password: this.password,
          },
        );

        // Handle the response as needed
        console.log('Response:', response.data);

        // Redirect to the home page after successful login
        this.$router.push('/home');
      } catch (error) {
        console.error('Error:', error.message);

        // Update errorMessage to show the error message to the user
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    },
  },
};
</script>

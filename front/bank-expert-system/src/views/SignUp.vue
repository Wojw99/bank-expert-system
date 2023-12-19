<template>
  <div>
    <h1>Sign Up</h1>

    <form @submit.prevent="signUp">
      <label for="username">
        Username:<input type="text" id="username" v-model="username" required />
      </label>
      <label for="password">
        Password:<input type="password" id="password" v-model="password" required />
      </label>
      <label for="role">
        Role:
        <select id="role" v-model="role" required>
          <option value="admin">admin</option>
          <option value="normal">user</option>
        </select>
      </label>
      <button type="submit">Sign Up</button>
    </form>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>

    <div>
      <p>Already have an account?</p>
      <router-link to="/signin">Log In</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignupPanel',
  data() {
    return {
      username: '',
      password: '',
      role: 'user', // Set a default value for the role
      errorMessage: '',
    };
  },
  methods: {
    async signUp() {
      try {
        const response = await axios.post('http://localhost:3000/auth/register', {
          username: this.username,
          password: this.password,
          role: this.role,
        });

        // Handle the response as needed
        console.log('Response:', response.data);

        // Redirect to the home page or login page after successful sign up
        this.$router.push('/signin');
      } catch (error) {
        console.error('Error:', error.message);

        // Check if the error has a response and the status is 400
        if (error.response && error.response.status === 400) {
          // Display a specific message for User already exists
          this.errorMessage = 'User already exists.';
        } else {
          // Display a generic message for other errors
          this.errorMessage = 'Sign up failed. Please try again.';
        }
      }
    },
  },
};
</script>

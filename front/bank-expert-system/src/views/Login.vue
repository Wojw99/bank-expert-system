<template>
  <div :style="{ width: '100%', height: '100vh' }">
    <h1>Sign In</h1>

    <div id="datesContainer">
      <label for="date">Login <input name="" id="date" v-model="login" />
      </label>
      <br>
      <label for="date">Password <input type="password" name="" id="date" v-model="password" />
      </label>
      <br>
      <button @click="SignIn">Enter</button>

    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPanel', // Changed the component name
  data() {
    return {
      date: '',
      dates: [], // Assuming you have this data property defined
      homePath: '/home', // Assuming you have this data property defined
    };
  },
  methods: {
    SignIn() {
      // Your SignIn method logic here
    },
  },
};
</script>

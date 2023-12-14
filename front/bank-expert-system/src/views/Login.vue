<template>
  <div :style="{ width: '100%', height: '100vh' }">
    <h1>Sign In</h1>

    <div id="datesContainer">
      <label for="date">Wybierz datę: <input type="date" name="" id="date" v-model="date" /></label>
      <button @click="dateChange">Zmień</button>

      <ul>
        <li v-for="date in dates" :key="date">
          {{ date }}
        </li>
        <li>
          <router-link class="routerPoint" :to="homePath">
            Home
          </router-link>
        </li>
      </ul>
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
    dateChange() {
      // Your dateChange method logic here
    },
  },
};
</script>

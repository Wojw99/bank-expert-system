<!-- App.vue -->
<template>
  <div>
    <top-menu></top-menu>
    <router-view />
    <div
      v-if="!settingsFetched"
      @click="fetchSettings"
      @keydown.enter="fetchSettings"
      tabindex="0"
      style="display: none;"
    ></div>
  </div>
</template>

<script>
// import axios from 'axios';
import store from '@/store/store';
import TopMenu from './components/TopMenu.vue';

export default {
  components: {
    TopMenu,
  },
  data() {
    return {
      settingsFetched: false,
    };
  },
  methods: {
    async fetchSettings() {
      try {
        const token = store.getters.authToken;
        // Send a request to the endpoint on component mount
        const response = await fetch('http://localhost:3000/settings/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Settings:', response.data);

        // Update the state to indicate that settings have been fetched
        this.settingsFetched = true;
      } catch (error) {
        console.error('Error fetching settings:', error.message);
      }
    },
  },
  mounted() {
    // Trigger the fetchSettings method when the component is mounted
    this.fetchSettings();
  },
};

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

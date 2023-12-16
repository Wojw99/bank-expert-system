<!-- App.vue -->
<template>
  <div>
    <top-menu></top-menu>
    <router-view />
  </div>
</template>

<script>
import TopMenu from './components/TopMenu.vue';

export default {
  components: {
    TopMenu,
  },
};
</script>

<style lang="scss">
/* Add your styles as needed */
</style>

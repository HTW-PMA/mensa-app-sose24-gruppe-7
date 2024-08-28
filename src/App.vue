<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/Navbar.vue'
import Carousel from './components/Carousel.vue';
</script>

<template>
  <HelloWorld msg="Vite + Vue" />
  <div id="app">
      <!-- Andere Komponenten oder Inhalte hier -->
    </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

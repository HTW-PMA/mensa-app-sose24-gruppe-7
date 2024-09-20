<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import Home from './pages/Home.vue';
</script>

<template>
  <div id="app">
    <!-- Navbar wird hier angezeigt -->
    <Navbar />

    <!-- Der Router-View zeigt die Inhalte basierend auf der Route -->
    <router-view></router-view>

    <!-- Footer wird unterhalb des Router-View angezeigt -->
    <Footer />
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

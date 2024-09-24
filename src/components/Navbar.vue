<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid">
      <img src="../assets/logo.jpg" alt="Logo" style="height: 40px; margin-right: 10px;" />
      <a class="navbar-brand" href="#">studybites</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/weekview">WeekView</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/favorites">Favorites</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/settings">Settings</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
body {
  padding-top: 70px; /* Damit der Seiteninhalt nicht von der Navbar überdeckt wird */
}
</style>
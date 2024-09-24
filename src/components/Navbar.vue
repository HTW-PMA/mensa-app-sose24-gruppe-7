<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
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
        <li class="nav-item active">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Dropdown
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><router-link class="dropdown-item" to="/weekview">WeekView</router-link></li>
            <li><router-link class="dropdown-item" to="/settings">Settings</router-link></li>
            <li><hr class="dropdown-divider"></li>
            <li><router-link class="dropdown-item" to="/cafeteriamap">Search for Cafeteria</router-link></li>
          </ul>
        </li>
      </ul>
      <form class="d-flex me-3">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
      <div class="navbar-nav">
        <router-link class="btn btn-outline-primary me-2" to="/signup">Sign Up</router-link>
        <!-- Hier den Login-Button verlinken -->
        <router-link class="btn btn-primary" to="/login">Sign In</router-link>
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

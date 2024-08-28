<script setup lang="ts">
import Navbar from './Navbar.vue'; 
import Carousel from './Carousel.vue'; // Importiere die Carousel-Komponente
import Footer from './Footer.vue';
import Feature from './Feature.vue';
import About from './About.vue';
</script>

<template>
  <Navbar />
  <!-- Hauptinhalt der Seite -->
  <div class="container mt-5 pt-5 d-flex">
    <!-- Linke Spalte: Text und Suche -->
    <div class="text-container">
      <h1>Are you starving?</h1>
      <p>Within a few clicks, find a cafeteria near you.</p>
      <h3>Search a mensa near you:</h3>
      <form class="search-form d-flex">
        <input
          class="form-control me-2 border border-primary"
          type="search"
          placeholder="Enter your address"
          aria-label="Search"
        />
        <button class="btn btn-primary" type="submit">Search</button>
      </form>
    </div>

    <!-- Rechte Spalte: Karussell -->
    <Carousel />
  </div>
    <!-- About -->
  <div>
    <About />
  </div>
   <!-- Feature -->
  <div> 
    <Feature />
  </div>
   <!-- Footer -->
  <div>
    <Footer />
  </div>
  
</template>

<style scoped>
/* Adding padding for the Navbar */
body {
  padding-top: 70px;
}

.text-container {
  max-width: 400px;
  margin-left: 0;
  margin-right: 40px;
  padding-left: 10px;
  flex-shrink: 0;
}

.search-form {
  margin-top: 20px;
}

.container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: calc(100vh - 70px);
  padding-bottom: 20px; /* Ensure space at the bottom */
}

/* Adjust the carousel container dimensions */
.carousel-container {
  max-width: 400px; /* Match the width with the carousel */
  height: auto;
  margin-top: 20px;
  margin-left: 20px;
}

.carousel {
  max-width: 400px;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 40px; /* Add some space below the carousel */
}

.carousel-inner {
  max-height: 300px;
  overflow: hidden;
}

.carousel-image {
  max-height: 300px;
  object-fit: cover;
}

</style>


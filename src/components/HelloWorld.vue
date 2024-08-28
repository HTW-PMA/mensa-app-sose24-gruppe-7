<script setup lang="ts">
import Navbar from './Navbar.vue'; 
import Carousel from './Carousel.vue'; // Importiere die Carousel-Komponente
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
</template>

<style scoped>
/* Füge Abstände für die Navbar hinzu, damit der Inhalt nicht verdeckt wird */
body {
  padding-top: 70px; /* Damit der Seiteninhalt nicht von der Navbar überdeckt wird */
}

.text-container {
  max-width: 400px; /* Begrenze die Breite des Textcontainers */
  margin-left: 0; /* Stelle sicher, dass der Container links ausgerichtet ist */
  padding-left: 10px; /* Leichter Abstand vom Rand */
}

.search-form {
  margin-top: 20px; /* Abstand zwischen den Texten und dem Suchfeld */
}

.container {
  display: flex;
  justify-content: space-between; /* Inhalte zwischen den beiden Spalten verteilen */
  align-items: flex-start; /* Inhalte oben ausrichten */
  height: calc(100vh - 70px); /* Volle Höhe minus die Höhe der Navbar */
}

.carousel {
  width: 100%;
  max-width: 600px; /* Begrenze die Breite des Karussells */
}

.carousel-image {
  object-fit: cover; /* Bild an den Container anpassen */
  height: 300px; /* Höhe des Karussells festlegen */
}

.carousel-indicators [data-bs-target] {
  background-color: #000; /* Farbe der Indikatoren */
}
</style>
<template>
  <Navbar />

  <!-- Hauptinhalt der Seite -->
  <div class="main-content">
    <!-- Hero-Sektion mit Karussell und CTA -->
    <section class="hero-section">
      <div class="container hero-container">
        <div class="hero-text">
          <h1>Are you starving?</h1>
          <p>Within a few clicks, find a cafeteria near you.</p>
          <h3>Search a mensa near you:</h3>
          <form class="search-form">
            <input
              class="form-control"
              type="search"
              placeholder="Enter your address"
              aria-label="Search"
            />
            <button class="btn btn-primary" type="submit">Search</button>
          </form>
        </div>
        <Carousel />
      </div>
    </section>

    <!-- Angebote oder Features -->
    <section class="offers-section">
      <div class="container offers-container">
        <div class="offer-card" v-for="offer in offers" :key="offer.id">
          <img :src="offer.image" alt="Offer Image" class="offer-image" />
          <div class="offer-details">
            <h4>{{ offer.title }}</h4>
            <p>{{ offer.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
      <h2>How does it work?</h2>
      <div class="container how-container">
        <div class="step" v-for="step in steps" :key="step.id">
          <div class="icon">{{ step.icon }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </div>
      </div>
    </section>

    <!-- About Us -->
    <section id="about" class="about-section">
      <About />
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue'; 
import Carousel from './Carousel.vue';
import Footer from './Footer.vue';
import About from './About.vue';
import { ref } from 'vue';

const offers = ref([
  { id: 1, title: '15% Off', description: 'Greys Vage', image: '../assets/offer1.png' },
  { id: 2, title: '10% Off', description: 'Greys Vage', image: '../assets/offer2.png' },
  { id: 3, title: '25% Off', description: 'Greys Vage', image: '../assets/offer3.png' },
  { id: 4, title: '20% Off', description: 'Greys Vage', image: '../assets/offer4.png' },
]);

const steps = ref([
  { id: 1, icon: '📍', title: 'Select Location', description: 'Choose the location of the cafeteria.' },
  { id: 2, icon: '🛒', title: 'Choose Order', description: 'Check over hundreds of menus.' },
  { id: 3, icon: '💳', title: 'Check your student card credit', description: 'It\'s quick, safe, and simple. Select several methods of payment.' },
]);
</script>

<style scoped>
/* Globale Layout-Einstellungen */
body {
  padding-top: 70px;
  font-family: Arial, sans-serif;
  margin: 0;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Hero-Sektion Layout */
.hero-section {
  width: 100vw; /* Breite auf 100% des Viewports setzen */
  background: linear-gradient(135deg, #44BBA4 0%, #368C7A 100%);
  padding: 60px 20px;
  text-align: center;
  overflow: hidden; /* Verhindert horizontales Scrollen */
  position: relative; /* Wichtig für die Positionierung der Inhalte */
}

.hero-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%; /* Container nimmt jetzt die gesamte Breite ein */
  max-width: 1200px;
  margin: auto;
  padding: 0 20px; /* Optional: padding für etwas Abstand am Rand */
}

.hero-text {
  max-width: 500px;
}

.hero-text h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  color: white;
}

.hero-text p {
  font-size: 1.25rem;
  margin-bottom: 20px;
  color: white;
}

.search-form {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.search-form .form-control {
  padding: 10px;
  font-size: 1rem;
  flex: 1;
}

.search-form .btn {
  padding: 10px;
  font-size: 1rem;
}


/* Carousel Layout */
.carousel {
  max-width: 600px;
  max-height: 400px;
  width: 100%;
}

.carousel-inner {
  max-height: 400px;
  overflow: hidden;
}

.carousel-image {
  max-height: 400px;
  object-fit: cover;
}

/* Angebote oder Features */
.offers-section {
  background-color: #ffffff;
  padding: 60px 20px;
  text-align: center;
}

.offers-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
}

.offer-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-align: left;
}

.offer-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.offer-details {
  padding: 15px;
}

/* How It Works Section */
.how-it-works {
  background-color: #f4f4f4;
  padding: 60px 20px;
  text-align: center;
}

.how-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1200px;
}

.step {
  text-align: center;
}

.step .icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.step h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

/* About Us Section */
.about-section {
  background-color: #ffffff;
  padding: 60px 20px;
  width: 100%;
  text-align: center;
}

/* Footer Section */
footer {
  width: 100vw; /* Breite auf 100% des Viewports setzen */
  background-color: #333;
  color: white;
  padding: 40px 20px;
  text-align: center;
  overflow: hidden; /* Verhindert horizontales Scrollen */
  position: relative; /* Wichtig für die Positionierung der Inhalte */
  min-height: 100px; /* Minimale Höhe für den Footer */
  flex-shrink: 0; /* Verhindert, dass der Footer schrumpft */
}

/* Falls der Footer den gesamten unteren Bereich einnehmen soll */
footer.full-height {
  height: 100vh; /* Nimmt die gesamte Höhe des Viewports ein */
}

</style>

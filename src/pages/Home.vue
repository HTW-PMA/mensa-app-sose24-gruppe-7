<template>
  <!-- Main Content of the Page -->
  <div class="main-content container">
    <!-- Hero Section as Card -->
    <div class="card my-5">
      <div class="card-body">
        <section class="hero-section text-center">
          <h1>Are you starving?</h1>
          <p>Within a few clicks, find a cafeteria near you.</p>
          <h3>Search a mensa near you:</h3>
          <form class="search-form">
            <div class="input-group mb-3">
              <input
                class="form-control"
                type="search"
                placeholder="Enter your address"
                aria-label="Search"
              />
              <button class="btn btn-primary" type="submit">Search</button>
            </div>
          </form>
        </section>
      </div>
    </div>

    <!-- Offers or Features Section -->
    <section class="offers-section mt-5">
      <h2 class="text-center mb-4">Our Offers</h2>
      <div class="row">
        <div class="col-md-3" v-for="offer in offers" :key="offer.id">
          <div class="card h-100">
            <img :src="offer.image" class="card-img-top" alt="Offer Image" />
            <div class="card-body">
              <h5 class="card-title">{{ offer.title }}</h5>
              <p class="card-text">{{ offer.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works mt-5">
      <h2 class="text-center mb-4">How does it work?</h2>
      <div class="row">
        <div class="col-md-4" v-for="step in steps" :key="step.id">
          <div class="card h-100 feature-card">
            <div class="card-body text-center">
              <div class="icon display-4">{{ step.icon }}</div>
              <h5 class="card-title mt-3">{{ step.title }}</h5>
              <p class="card-text">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us Section -->
    <section id="about" class="about-section mt-5">
      <h2 class="text-center mb-4">About Us</h2>
      <div class="card about-card">
        <div class="card-body text-center">
          <h5>About Us</h5>
          <p>We help you find the best cafeterias around with just a few clicks. Whether you're looking for a quick bite or a full meal, our platform provides you with the best options.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Offers
const offers = ref([
  { id: 1, title: '15% Off', description: 'Greys Vage', image: '../assets/offer1.png' },
  { id: 2, title: '10% Off', description: 'Greys Vage', image: '../assets/offer2.png' },
  { id: 3, title: '25% Off', description: 'Greys Vage', image: '../assets/offer3.png' },
  { id: 4, title: '20% Off', description: 'Greys Vage', image: '../assets/offer4.png' },
]);

// How it Works Steps
const steps = ref([
  { id: 1, icon: '📍', title: 'Select Location', description: 'Choose the location of the cafeteria.' },
  { id: 2, icon: '🛒', title: 'Choose Order', description: 'Check over hundreds of menus.' },
  { id: 3, icon: '💳', title: 'Check your student card credit', description: 'It\'s quick, safe, and simple. Select several methods of payment.' },
]);
</script>

<style scoped>
/* General Styling */
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Hero Section */
.hero-section {
  padding: 40px 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  justify-content: center;
}

.search-form .input-group {
  max-width: 600px;
}

/* Offers Section */
.offers-section {
  padding: 40px 0;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

/* How It Works Section */
.how-it-works {
  background-color: #ffffff; /* Set background of the section to white */
  padding: 40px 0;
}

.feature-card {
  background-color: #f4f4f4; /* Set individual cards to light gray */
  border: none; /* Remove border to make the gray background look smooth */
  border-radius: 10px; /* Optional: Slightly round the card edges */
}

.icon {
  font-size: 2.5rem;
  color: #007bff;
}

.step .card-body {
  padding: 20px;
}

/* About Us Section */
.about-section {
  background-color: #ffffff; /* Set section background to white */
  padding: 40px 0;
}

.about-card {
  background-color: #f4f4f4; /* Set the card to light gray */
  border: none; /* Remove the card border */
  border-radius: 10px; /* Slightly round the card edges */
}

.about-card .card-body {
  padding: 30px;
}
</style>

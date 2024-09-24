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
          <div class="mb-3 form-group">
            <div class="input-group">
              <select class="form-select" id="mensaSelect" v-model="selectedMensa">
                <option v-for="mensa in mensas" :key="mensa.id" :value="mensa.id">{{ mensa.name }}</option>
              </select>
              <!-- Pin button for nearest cafeteria -->
              <button class="btn btn-outline-primary" @click="findNearestCafeteria">
                📍
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Offers Section -->
    <div class="offers-section container mt-5">
    <h2 class="text-center mb-4">Our Offers</h2>
    <div class="d-flex justify-content-between flex-wrap">
      <div class="card mb-4" v-for="offer in offers" :key="offer.id" style="width: 18rem;">
        <img :src="offer.image" class="card-img-top" alt="Offer Image" />
        <div class="card-body">
          <h5 class="card-title">{{ offer.title }}</h5>
          <p class="card-text">{{ offer.description }}</p>
        </div>
      </div>
    </div>
  </div>

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

<script>
import { ref, onMounted, watch } from 'vue';
import canteens from '../../canteen.json';

import burgerImage from '@/assets/burger.jpg';
import foodImage from '@/assets/food.jpg';
import veganFoodImage from '@/assets/vegan-food.jpg';
import vegieImage from '@/assets/vegie.jpg';

export default {
  setup() {
    const offers = ref([
      { id: 1, title: '15% Off', description: 'Greys Vage', image: burgerImage },
      { id: 2, title: '10% Off', description: 'Greys Vage', image: foodImage },
      { id: 3, title: '25% Off', description: 'Greys Vage', image: veganFoodImage },
      { id: 4, title: '20% Off', description: 'Greys Vage', image: vegieImage },
    ]);

    const steps = ref([
      { id: 1, icon: '📍', title: 'Select Location', description: 'Choose the location of the cafeteria.' },
      { id: 2, icon: '🛒', title: 'Choose Order', description: 'Check over hundreds of menus.' },
      { id: 3, icon: '💳', title: 'Check your student card credit', description: 'It\'s quick, safe, and simple. Select several methods of payment.' },
    ]);

    const selectedMensa = ref(localStorage.getItem('selectedMensa') || '');
    const mensas = ref([]);
    const allMensas = ref([]);

    const extractData = () => {
      allMensas.value = canteens.map(canteen => ({
        name: canteen.name,
        universities: canteen.universities,
        id: canteen.id,
        address: canteen.address
      }));
      mensas.value = allMensas.value;
    };

    const saveSelection = () => {
      localStorage.setItem('selectedMensa', selectedMensa.value);
    };

    const findNearestCafeteria = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setNearestCafeteria, showError);
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    };

    const setNearestCafeteria = (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      let nearestMensa = null;
      let minDistance = Infinity;

      allMensas.value.forEach((mensa) => {
        const mensaLat = mensa.address.geoLocation.latitude;
        const mensaLng = mensa.address.geoLocation.longitude;
        const distance = calculateDistance(userLat, userLng, mensaLat, mensaLng);
        if (distance < minDistance) {
          minDistance = distance;
          nearestMensa = mensa;
        }
      });

      if (nearestMensa) {
        selectedMensa.value = nearestMensa.id;
        saveSelection();
        alert(`Die nächste Mensa ist: ${nearestMensa.name}`);
      } else {
        alert('Keine Mensa gefunden.');
      }
    };

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const toRad = value => (value * Math.PI) / 180;
      const R = 6371; // Radius of the Earth in km
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    };

    const showError = (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert('User denied the request for Geolocation.');
          break;
        case error.POSITION_UNAVAILABLE:
          alert('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          alert('The request to get user location timed out.');
          break;
        case error.UNKNOWN_ERROR:
          alert('An unknown error occurred.');
          break;
      }
    };

    onMounted(() => {
      extractData();
    });

    watch(selectedMensa, (newValue) => {
      saveSelection();
      // Clear relevant local storage items
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('meals_') || key.startsWith('menue_') || key === 'badges') {
          localStorage.removeItem(key);
          console.log('removed', key);
        }
      });
    });

    return {
      offers,
      steps,
      selectedMensa,
      mensas,
      findNearestCafeteria
    };
  }
};
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
  background-color: #ffffff;
  padding: 40px 0;
}

.feature-card {
  background-color: #f4f4f4;
  border: none;
  border-radius: 10px;
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
  background-color: #ffffff;
  padding: 40px 0;
}

.about-card {
  background-color: #f4f4f4;
  border: none;
  border-radius: 10px;
}

.about-card .card-body {
  padding: 30px;
}
</style>

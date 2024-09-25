<template>
  <!-- Main Content of the Page -->
  <div class="main-content container">
    <!-- Hero Section as Card -->
    <div class="card my-5">
      <div class="card-body">
        <section class="hero-section text-center">
          <h1>Bist du schon hunrig?</h1>
          <p>Mit nur wenigen Klicks findest du eine Mensa in deiner Nähe. Klicke einfach auf den Pin, um deinem Ziel einen Schritt näher zu kommen.</p>
          <h3>Mensen in deiner:</h3>
          
        <!-- Mensa Selection with Pin Button -->
        <MensaSelector v-model:selectedMensa="selectedMensa" />
        </section>
      </div>
    </div>

    <!-- Offers Section -->
    <div class="offers-section container mt-5">
      <h2 class="text-center mb-4">Unser Angebot</h2>
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
      <h2 class="text-center mb-4">Wie funktioniert die App?</h2>
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
      <h2 class="text-center mb-4">Über uns</h2>
      <div class="card about-card">
        <div class="card-body text-center">
          <p>Mit StudyBites findest du ganz einfach die besten Mensen in Berlin. Unsere App bietet dir nicht nur aktuelle Speisepläne, sondern auch Informationen zu Inhaltsstoffen, Allergenen und Umweltbilanz. Egal ob du etwas Kleines oder eine volle Mahlzeit suchst – StudyBites zeigt dir die besten Optionen in deiner Nähe.</p>
          
          <!-- QR Code Image -->
          <img src="@/assets/studybites-1024.svg" alt="QR Code" class="qr-code mt-4" />

          <!-- Text Box Below QR Code -->
          <div class="info-box mt-4 p-3">
            <p>Für ein besseres Nutzererlebnis könnt ihr auch unseren QR-Code scannen und euch die Anwendung bequem auf dem Handy anschauen.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import { ref, onMounted, watch } from 'vue';
import canteens from '../../canteen.json';
import MensaSelector from '../components/MensaSelector.vue';
import featureImage from '@/assets/feature1.jpg';
import foodImage from '@/assets/food.jpg';
import veganFoodImage from '@/assets/vegan-food.jpg';
import vegieImage from '@/assets/vegie.jpg';

export default {
  components: {
    MensaSelector
  },
  setup() {
    const offers = ref([
      { id: 1, title: 'Tägliches Menü', description: 'Erhalte schnellen Zugang zu den aktuellen Speiseplänen der Berliner Mensen und bleibe immer informiert über die verfügbaren Gerichte.', image: featureImage },
      { id: 2, title: 'Inhaltsstoffe & Allergene', description: 'Finde detaillierte Informationen zu den Inhaltsstoffen und Allergenen der Gerichte, um sicherzustellen, dass du gut informiert bist.', image: foodImage },
      { id: 3, title: 'Nachhaltigkeitsinformation', description: 'Erfahre mehr über den Wasser- und CO₂-Verbrauch jedes Gerichts, um nachhaltigere Entscheidungen zu treffen.', image: veganFoodImage },
      { id: 4, title: 'Nächstgelegene Mensa', description: 'Lass dir die nächstgelegene Mensa anzeigen, damit du immer weißt, wo du schnell und bequem essen kannst.', image: vegieImage },
    ]);

    const steps = ref([
  { 
    id: 1, 
    icon: '📍', 
    title: 'Standort wählen', 
    description: 'Wähle die Mensa in deiner Nähe aus.' 
  },
  { 
    id: 2, 
    icon: '🍽️', 
    title: 'Speisekarte anzeigen', 
    description: 'Durchsuche die aktuellen Speisepläne und finde dein Lieblingsgericht.' 
  },
  { 
    id: 3, 
    icon: '💳', 
    title: 'Konto prüfen', 
    description: 'Überprüfe schnell dein Guthaben auf der Mensa-Karte. Einfach und sicher.' 
  },
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
  border-color: #8EE5EE;
  border-radius: 10px;
  border-width: 4px; /* Dickere Border */
  border-style: solid; /* Stellen Sie sicher, dass der Rand sichtbar ist */
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

/* QR Code Styling */
.qr-code {
  width: 200px;
  height: auto;
}

/* Text Box Styling */
.info-box {
  background-color: #f0f8ff;
  border-radius: 10px;
  border: 2px solid #8EE5EE;
  max-width: 400px;
  margin: 0 auto; /* Center the box */
  text-align: center;
  font-size: 1.1rem;
  color: #333;
}
</style>



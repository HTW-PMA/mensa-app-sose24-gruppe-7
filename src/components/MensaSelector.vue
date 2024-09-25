<template>
    <div class="mb-3 form-group">
      <div class="input-group">
        <select class="form-select" id="mensaSelect" v-model="selectedMensaId" @change="updateSelectedMensa">
          <option value="">{{ selectedMensaName || 'Bitte wählen Sie eine Mensa' }}</option>
          <option v-for="mensa in sortedMensas" :key="mensa.id" :value="mensa.id">{{ mensa.name }}</option>
        </select>
        <button class="btn btn-outline-primary" @click="findNearestCafeteria">
          📍
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  import canteens from '../../canteen.json';
  
  export default {
    name: 'MensaSelector',
    props: {
      showLabel: {
        type: Boolean,
        default: true
      }
    },
    emits: ['update:selectedMensa'],
    setup(props, { emit }) {
      const selectedMensaId = ref(localStorage.getItem('selectedMensaId') || '');
      const selectedMensaName = ref(localStorage.getItem('selectedMensaName') || '');
      const mensas = ref([]);
  
      const extractData = () => {
        mensas.value = canteens.map(canteen => ({
          name: canteen.name,
          universities: canteen.universities,
          id: canteen.id,
          address: canteen.address
        }));
      };
  
      const sortedMensas = computed(() => {
        return [...mensas.value].sort((a, b) => a.name.localeCompare(b.name));
      });
  
      const updateSelectedMensa = () => {
        const selectedMensaObj = mensas.value.find(mensa => mensa.id === selectedMensaId.value);
        if (selectedMensaObj) {
          selectedMensaName.value = selectedMensaObj.name;
          localStorage.setItem('selectedMensaId', selectedMensaObj.id);
          localStorage.setItem('selectedMensaName', selectedMensaObj.name);
          emit('update:selectedMensa', selectedMensaObj.id);
        } else {
          selectedMensaName.value = '';
          localStorage.removeItem('selectedMensaId');
          localStorage.removeItem('selectedMensaName');
          emit('update:selectedMensa', '');
        }
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
  
        mensas.value.forEach((mensa) => {
          const mensaLat = mensa.address.geoLocation.latitude;
          const mensaLng = mensa.address.geoLocation.longitude;
          const distance = calculateDistance(userLat, userLng, mensaLat, mensaLng);
          if (distance < minDistance) {
            minDistance = distance;
            nearestMensa = mensa;
          }
        });
  
        if (nearestMensa) {
          selectedMensaId.value = nearestMensa.id;
          updateSelectedMensa();
          alert(`Die nächste Mensa ist: ${nearestMensa.name}`);
        } else {
          alert('Keine Mensa gefunden.');
        }
      };
      
      const calculateDistance = (lat1, lng1, lat2, lng2) => {  // Function to calculate the distance between two geographical points 

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
  
      extractData(); // Call `extractData` to populate the Mensa list when the component is mounted
  
      watch(selectedMensaId, () => {
        updateSelectedMensa();
      });
  
      return {
        selectedMensaId,
        selectedMensaName,
        sortedMensas,
        updateSelectedMensa,
        findNearestCafeteria
      };
    }
  };
  </script>
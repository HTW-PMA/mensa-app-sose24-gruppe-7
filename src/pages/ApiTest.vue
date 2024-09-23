<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const mensen = ref([]);  // Variable für die API-Daten

// Methode zum Abrufen der Daten
const testApi = async () => {
  try {
    const response = await axios.get('https://mensa.gregorflachs.de/api/v1/canteen', {
      headers: {
        'X-API-KEY': 'DEIN_API_KEY_HIER',  // API-Key hinzufügen
      },
    });
    mensen.value = response.data;  // Daten aus der API-Antwort speichern
    console.log('API Response:', response.data);  // Antwort in der Konsole ausgeben
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);  // Fehlerbehandlung
  }
};

// Die API beim Laden der Komponente automatisch testen
testApi();
</script>

<template>
  <div>
    <h1>Mensa API Test</h1>
    <ul>
      <!-- Anzeige der Mensen-Daten, falls verfügbar -->
      <li v-for="mensa in mensen" :key="mensa.ID">{{ mensa.name }}</li>
    </ul>
  </div>
</template>

<style scoped>
/* Optionales Styling */
</style>

<template>
    <div class="legend-container">
      <div v-for="item in legendItems" :key="item.label" class="legend-item">
        <h5>{{ item.label }}</h5>
        <p v-html="item.description"></p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    name: 'Legend',
    data() {
      return {
        legendItems: [
          {
            label: 'Ampelfarben',
            description: `
              <span><strong>Grüner Punkt:</strong> Niedriger CO₂-Fußabdruck oder Wasserverbrauch</span><br />
              <span><strong>Gelber Punkt:</strong> Mittlerer CO₂-Fußabdruck oder Wasserverbrauch</span><br />
              <span><strong>Roter Punkt:</strong> Hoher CO₂-Fußabdruck oder Wasserverbrauch</span>
            `,
          },
          {
            label: 'CO₂ Bewertung',
            description: `
              <span><strong>A:</strong> Niedriger CO₂-Ausstoß</span><br />
              <span><strong>B:</strong> Mittlerer CO₂-Ausstoß</span><br />
              <span><strong>C:</strong> Hoher CO₂-Ausstoß</span>
            `,
          },
          {
            label: 'H₂O Bewertung',
            description: `
              <span><strong>A:</strong> Niedriger Wasserverbrauch</span><br />
              <span><strong>B:</strong> Mittlerer Wasserverbrauch</span><br />
              <span><strong>C:</strong> Hoher Wasserverbrauch</span>
            `,
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .legend-container {
    margin-top: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .legend-item {
    margin-bottom: 10px;
  }
  
  .legend-item h5 {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .legend-item p {
    margin: 0;
    font-size: 0.9rem;
  }
  </style>
  
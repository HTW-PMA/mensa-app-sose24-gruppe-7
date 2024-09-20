<template>
    <div class="carousel-container">
      <!-- Karussell auf der linken Seite -->
      <div id="carouselExampleIndicators" class="carousel slide ms-5" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="5" aria-label="Slide 6"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="6" aria-label="Slide 7"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active" @click="selectImage('../assets/pic1.png')">
            <img src="../assets/pic1.png" class="d-block w-100 carousel-image" alt="Image 1">
          </div>
          <div class="carousel-item" @click="selectImage('../assets/pic2.png')">
            <img src="../assets/pic2.png" class="d-block w-100 carousel-image" alt="Image 2">
          </div>
          <div class="carousel-item" @click="selectImage('../assets/pic3.png')">
            <img src="../assets/pic3.png" class="d-block w-100 carousel-image" alt="Image 3">
          </div>
          <div class="carousel-item" @click="selectImage('../assets/pic4.png')">
            <img src="../assets/pic4.png" class="d-block w-100 carousel-image" alt="Image 4">
          </div>
          <div class="carousel-item" @click="selectImage('../assets/pic5.png')">
            <img src="../assets/pic5.png" class="d-block w-100 carousel-image" alt="Image 5">
          </div>
          <div class="carousel-item" @click="selectImage('../assets/pic6.png')">
            <img src="../assets/pic6.png" class="d-block w-100 carousel-image" alt="Image 6">
          </div>
          <div class="carousel-item" @click="selectImage('../assets/pic7.png')">
            <img src="../assets/pic7.png" class="d-block w-100 carousel-image" alt="Image 7">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      
      <!-- Großes Bild auf der rechten Seite -->
      <div class="selected-image-container ms-5">
        <img :src="selectedImage" alt="Selected Image" class="selected-image">
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // Referenz für das aktuell ausgewählte Bild
  const selectedImage = ref('../assets/pic1.png'); // Standardmäßig erstes Bild ausgewählt
  
  // Funktion zum Auswählen eines Bildes
  function selectImage(imageSrc: string) {
    selectedImage.value = imageSrc;
  }
  </script>
  
  <style scoped>
  .carousel-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: auto;
  }
  
  .carousel {
    max-width: 400px;
    margin: auto;
    margin-top: 20px;
    margin-bottom: 40px;
  }
  
  .carousel-inner {
    max-height: 300px;
    overflow: hidden;
  }
  
  .carousel-image {
    max-height: 300px;
    object-fit: cover;
  }
  
  .selected-image-container {
    max-width: 600px;
  }
  
  .selected-image {
    max-width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 20px; /* Optional: Abrundung der Ecken */
  }
  </style>
  
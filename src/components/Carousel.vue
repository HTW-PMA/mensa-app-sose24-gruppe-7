<template>
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
        <div class="carousel-item active">
          <img src="../assets/pic1.png" class="d-block w-100 carousel-image" alt="Image 1">
        </div>
        <div class="carousel-item">
          <img src="../assets/pic2.png" class="d-block w-100 carousel-image" alt="Image 2">
        </div>
        <div class="carousel-item">
          <img src="../assets/pic3.png" class="d-block w-100 carousel-image" alt="Image 3">
        </div>
        <div class="carousel-item">
          <img src="../assets/pic4.png" class="d-block w-100 carousel-image" alt="Image 4">
        </div>
        <div class="carousel-item">
          <img src="../assets/pic5.png" class="d-block w-100 carousel-image" alt="Image 5">
        </div>
        <div class="carousel-item">
          <img src="../assets/pic6.png" class="d-block w-100 carousel-image" alt="Image 6">
        </div>
        <div class="carousel-item">
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
  </template>
  
  <script setup lang="ts">
  // No additional scripts needed
  </script>
  
  <style scoped>
  .carousel {
    max-width: 400px; /* Adjust the max-width */
    margin: auto;
    margin-top: 20px;
    margin-bottom: 40px; /* Ensure there's enough space below the carousel */
  }
  
  .carousel-inner {
    max-height: 300px; /* Adjust the height */
    overflow: hidden;
  }
  
  .carousel-image {
    max-height: 300px; /* Ensure images fit within the height */
    object-fit: cover;
  }
  </style>
  
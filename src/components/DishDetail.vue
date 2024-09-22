<template>
    <div class="dish-detail">
      <!-- Header with back and favorite buttons -->
      <div class="header">
        <button @click="goBack" class="back-button">←</button>
        <button class="fav-button">♥</button>
      </div>
  
      <!-- Image of the dish -->
      <div class="dish-image-container">
        <img src="https://via.placeholder.com/100" alt="Dish 1 Image" class="menu-img">
      </div>
  
      <!-- Dish Information -->
      <div class="dish-info">
        <h1>{{ dishName }}</h1>
        <div class="rating-calories">
          <span class="rating">⭐ {{ rating }}</span>
          <span class="calories">{{ calories }}Kcal</span>
        </div>
        <div class="price">
          <span>$ {{ price.toFixed(2) }}</span>
        </div>
  
        <!-- Quantity controls -->
        <div class="quantity">
          <button @click="decreaseQuantity">-</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQuantity">+</button>
        </div>
  
        <!-- Ingredients -->
        <div class="ingredients">
          <h3>Ingredients</h3>
          <div class="ingredient-list">
            <span v-for="ingredient in ingredients" :key="ingredient" class="ingredient">
              {{ ingredient }}
            </span>
          </div>
        </div>
  
        <!-- Add to cart button -->
        <button class="add-to-cart">Add to Cart</button>
      </div>

     
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  // Mock data (this could come from props or an API)
  const dishName = ref('Fresh Pizza');
  const dishImage = ref('/path-to-your-image/pizza.png');  // Make sure the image path is correct
  const rating = ref(4.5);
  const calories = ref(348);
  const price = ref(10.49);
  const ingredients = ref(['Black Pasta', 'Shrimp', 'Tomato']);
  const quantity = ref(1);
  
  // Functions to increase/decrease quantity
  const increaseQuantity = () => {
    quantity.value++;
  };
  
  const decreaseQuantity = () => {
    if (quantity.value > 1) {
      quantity.value--;
    }
  };
  
  // Function to handle back navigation
  const goBack = () => {
    router.go(-1);
  };
  </script>
  
  <style scoped>
  /* Make the container take the full height and use flexbox for layout */
  .dish-detail {
    display: flex;
    flex-direction: column;
    min-height: 100vh;  /* Ensures that the page takes the full viewport height */
  }
  
  /* Header styles */
  .header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }
  
  .back-button, .fav-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  /* Dish image styles */
  .dish-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .menu-img {
    width: 250px;
    height: 250px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 20px;
  }
  
  /* Dish info */
  .dish-info {
    text-align: center;
    flex: 1; /* This makes the content stretch to fill the available space */
    padding: 20px;
  }
  
  .rating-calories {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .price {
    font-size: 2rem;
    color: #2d9a2d;
    margin-bottom: 20px;
  }
  
  .quantity {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .quantity button {
    background-color: #2d9a2d;
    color: white;
    border: none;
    padding: 5px 10px;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .ingredients {
    margin-bottom: 20px;
  }
  
  .ingredient-list {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  
  .ingredient {
    background-color: #f0f0f0;
    padding: 5px 10px;
    border-radius: 20px;
  }
  
  .add-to-cart {
    background-color: #2d9a2d;
    color: white;
    padding: 10px 20px;
    font-size: 1.2rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
  
  /* Footer styles */
  .footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 10px;
    margin-top: auto; /* Ensures that the footer sticks to the bottom */
  }
  </style>
  
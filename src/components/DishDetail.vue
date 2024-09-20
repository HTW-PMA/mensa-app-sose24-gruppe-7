<template>
  <div class="dish-detail">
    <!-- Header with back and favorite buttons -->
    <div class="header">
      <button @click="goBack" class="back-button">←</button>
      <button class="fav-button">♥</button>
    </div>

    <!-- Image of the dish -->
    <div class="dish-image-container">
      <img :src="dishImage" alt="Dish Image" class="dish-image" />
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
.dish-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f4f4f4;
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.back-button, .fav-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  padding: 10px;
  cursor: pointer;
}

.dish-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dish-image {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 50%;  /* This ensures the image is round */
  margin-bottom: 20px;
}

.dish-info {
  text-align: center;
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
</style>

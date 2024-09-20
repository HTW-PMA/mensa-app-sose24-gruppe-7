<template>
    <div class="menu-container">
      <div class="navigation">
        <button id="prev" class="arrow-button">←</button>
        <div class="days">
          <div class="day" id="mon">
            <p>MON</p>
            <p class="date" id="date-mon">16</p>
          </div>
          <div class="day" id="tue">
            <p>TUE</p>
            <p class="date" id="date-tue">17</p>
          </div>
          <div class="day" id="wed">
            <p>WED</p>
            <p class="date" id="date-wed">18</p>
          </div>
          <div class="day selected" id="thu">
            <p>THU</p>
            <p class="date" id="date-thu">19</p>
          </div>
          <div class="day" id="fri">
            <p>FRI</p>
            <p class="date" id="date-fri">20</p>
          </div>
        </div>
        <button id="next" class="arrow-button">→</button>
      </div>
  
      <!-- Menu for the selected day -->
      <div class="menu">
        <h3 id="menu-day">Menu for Thursday, 19th September</h3>
  
        <ul class="menu-list">
          <!-- Dish 1 -->
          <li class="menu-item">
            <router-link :to="{ name: 'DishDetail', params: { id: 1 } }" class="menu-link">
              <img src="https://via.placeholder.com/100" alt="Dish 1 Image" class="menu-img">
              <div class="menu-description">
                <div class="dish-header">
                  <h4>Spaghetti Bolognese</h4>
                  <span class="vegan-label non-vegan">Non-Vegan</span> <!-- Vegan status -->
                </div>
                <p>A classic Italian pasta dish with a rich meat sauce.</p>
                <p class="price">$8.99</p> <!-- Price -->
                <!-- Ingredients -->
                <div class="ingredients">
                  <span class="ingredient">Pasta</span>
                  <span class="ingredient">Beef</span>
                  <span class="ingredient">Tomato</span>
                </div>
              </div>
            </router-link>
          </li>
  
          <!-- Dish 2 -->
          <li class="menu-item">
            <router-link :to="{ name: 'DishDetail', params: { id: 2 } }" class="menu-link">
              <img src="https://via.placeholder.com/100" alt="Dish 2 Image" class="menu-img">
              <div class="menu-description">
                <div class="dish-header">
                  <h4>Grilled Chicken Salad</h4>
                  <span class="vegan-label non-vegan">Non-Vegan</span>
                </div>
                <p>Fresh greens topped with grilled chicken and a light dressing.</p>
                <p class="price">$9.50</p>
                <div class="ingredients">
                  <span class="ingredient">Chicken</span>
                  <span class="ingredient">Lettuce</span>
                  <span class="ingredient">Olive Oil</span>
                </div>
              </div>
            </router-link>
          </li>
  
          <!-- Dish 3 (Vegan Dish) -->
          <li class="menu-item">
            <router-link :to="{ name: 'DishDetail', params: { id: 3 } }" class="menu-link">
              <img src="https://via.placeholder.com/100" alt="Dish 3 Image" class="menu-img">
              <div class="menu-description">
                <div class="dish-header">
                  <h4>Vegetable Stir-Fry</h4>
                  <span class="vegan-label vegan">Vegan</span> <!-- Vegan status -->
                </div>
                <p>A healthy mix of stir-fried vegetables served with rice.</p>
                <p class="price">$7.25</p>
                <div class="ingredients">
                  <span class="ingredient">Carrots</span>
                  <span class="ingredient">Broccoli</span>
                  <span class="ingredient">Soy Sauce</span>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  // No changes needed in the script for now
  </script>
  
  <style scoped>
  .menu-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20px;
  }
  
  .navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .arrow-button {
    background-color: transparent;
    border: none;
    font-size: 2rem;
    cursor: pointer;
  }
  
  .days {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
  
  .day {
    text-align: center;
    padding: 10px;
    color: gray;
    transition: color 0.3s ease;
  }
  
  .day p {
    margin: 0;
  }
  
  .selected {
    color: black;
    font-weight: bold;
  }
  
  .date {
    font-size: 1rem;
    color: gray;
  }
  
  .menu {
    text-align: center;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin: 5px 0;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
  }
  
  .menu-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .menu-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .menu-description {
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .dish-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* Ensure full width */
}
  
  .price {
    font-size: 1rem;
    color: #2d9a2d;
    margin-top: 5px;
  }
  
  .ingredients {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }
  
  .ingredient {
    background-color: #f0f0f0;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
  }
  
  .vegan-label {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: white;
  min-width: 80px; /* Ensures all labels have the same width */
  text-align: center; /* Centers the label text */
  margin-left: auto; /* Pushes the label to the right */
}
  
.vegan {
  background-color: #2d9a2d;
}

.non-vegan {
  background-color: #d9534f;
}
  </style>
  
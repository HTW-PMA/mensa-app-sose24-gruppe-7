<template>
  <div class="favorites-section container mt-5">
    <h2 class="text-center mb-5">Deine Lieblingsgerichte!</h2>
    <div v-if="favoriteMeals.length > 0" class="row">
      <div 
        class="col-md-6 col-lg-4 mb-4" 
        v-for="meal in favoriteMeals" 
        :key="meal.id"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <div class="dish-header">
              <div class="meal-header">
                <h5 class="meal-title mb-2">{{ meal.name || 'Unnamed Meal' }}</h5>
                <button @click="removeMeal(meal.id)" class="favorite-button" title="Remove from favorites">
                  <span>★</span>
                </button>
              </div>
              <div class="badges-wrapper">
                <div class="badges">
                  <span v-for="badgeId in meal.badges" :key="badgeId"
                    :class="['badge', 'badge-item', `${getBadgeName(badgeId).type}-badge`]">
                    <span v-if="getBadgeName(badgeId).showText">{{ getBadgeName(badgeId).name }}</span>
                  </span>
                  <span :class="['badge', 'category-badge', `${getCategoryStyle(meal.category).type}-badge`]">
                    {{ meal.category }}
                  </span>
                </div>
              </div>
              <div class="menu-description">
                <p class="badge-descriptions">
                  <template v-for="badgeId in meal.badges" :key="badgeId">
                    {{ getBadgeDescription(badgeId) }}
                  </template>
                </p>
                <p class="additives-info">
                  Allergene: 
                  <span v-for="additiveId in meal.additives" :key="additiveId" class="additive">
                    {{ getAdditiveText(additiveId) }}
                  </span>
                </p>
              </div>
              <div class="prices">
                <span v-for="priceItem in filteredPrices(meal)" :key="priceItem.priceType" class="price">
                  {{ priceItem.priceType }}: {{ priceItem.price.toFixed(2) }}€
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Favorites -->
    <div v-else class="text-center">
      <p class="lead">Leider hast du noch keine Favoriten gespeichert.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // `ref` creates reactive variables, `onMounted` runs code after the component is mounted
import apiService from '../services/apiService'; // Importing the API service that handles requests to get data from the backend

// Reactive variables to store favorite meals, badges, and additives
const favoriteMeals = ref([]); // A list to store favorite meals, initialized as an empty array
const badges = ref([]); // A list to store badges, initialized as an empty array
const additives = ref([]); // A list to store additives, initialized as an empty array

// Runs once the component is mounted
onMounted(async () => {
  const storedFavoriteIds = JSON.parse(localStorage.getItem('favoriteMeals') || '[]'); // Get favorite meal IDs from localStorage (or an empty array if none exist)
  favoriteMeals.value = await fetchFavoriteMeals(storedFavoriteIds); // Fetch the meal details for each favorite meal ID and store them in `favoriteMeals`
  await fetchBadges(); // Fetch badge data (like 'vegan', 'vegetarian', etc.)
  await fetchAdditives(); // Fetch additives data (like allergens or preservatives)
});

// Function to fetch meal details by their IDs
const fetchFavoriteMeals = async (mealIds) => {
  const meals = []; // Create an empty array to store the meals
  for (const mealId of mealIds) {
    try {
      const meal = await apiService.getMeal(mealId); // Call the API to get meal details by ID
      meals.push(meal); // Add the meal to the array if the fetch is successful
    } catch (error) {
      console.error(`Error fetching meal with ID ${mealId}:`, error); // Log any error that occurs during the fetch process
    }
  }
  return meals; // Return the array of meals after fetching all meal details
};

// Function to remove a meal from the favorite list
const removeMeal = (mealId) => {
  favoriteMeals.value = favoriteMeals.value.filter(meal => meal.id !== mealId); // Filter out the meal to remove it from `favoriteMeals`
  const updatedFavoriteIds = favoriteMeals.value.map(meal => meal.id); // Update the list of favorite meal IDs
  localStorage.setItem('favoriteMeals', JSON.stringify(updatedFavoriteIds)); // Save the updated list of favorite IDs back to localStorage
};

// Function to filter meal prices based on the user's role (e.g., 'Student', 'Employee')
const filteredPrices = (meal) => {
  const selectedRole = localStorage.getItem('selectedRole') || 'Studierende'; // Get the selected role from localStorage, defaulting to 'Student'
  return meal.prices.filter(priceItem => priceItem.priceType === selectedRole); // Filter prices that match the selected role
};

// Function to fetch badge data (like 'vegan', 'vegetarian', etc.)
const fetchBadges = async () => {
  try {
    badges.value = await apiService.getBadges(); // Call the API to get the badges and store them in `badges`
  } catch (error) {
    console.error('Error fetching badges:', error); // Log any error that occurs during the fetch process
  }
};

// Function to fetch additives data (like allergens or preservatives)
const fetchAdditives = async () => {
  try {
    additives.value = await apiService.getAdditives(); // Call the API to get the additives and store them in `additives`
  } catch (error) {
    console.error('Error fetching additives:', error); // Log any error that occurs during the fetch process
  }
};

// Function to get the name and type of a badge by its ID
const getBadgeName = (badgeId) => {
  const badge = badges.value.find(b => b.id === badgeId); // Find the badge by its ID in the `badges` array
  const name = badge ? badge.name : 'Unknown Badge'; // If badge exists, return its name; otherwise, return 'Unknown Badge'
  let type = 'default'; // Default type for badge
  let showText = true; // By default, show the badge text

  // Some badge names result in different types or hiding text
  if (name.length === 1) {
    return { name: '', type, showText: false }; // If the badge name is only 1 character, don't show it
  }

  // Set badge type based on its name
  switch (name.toUpperCase()) {
    case 'VEGAN':
      type = 'vegan'; // Set type for vegan badge
      break;
    case 'VEGETARISCH':
      type = 'vegetarian'; // Set type for vegetarian badge
      break;
    case 'GRÜNER AMPELPUNKT':
      type = 'green-dot'; // Set type for green dot badge and hide the text
      showText = false;
      break;
    case 'GELBER AMPELPUNKT':
      type = 'yellow-dot'; // Set type for yellow dot badge and hide the text
      showText = false;
      break;
    case 'ROTER AMPELPUNKT':
      type = 'red-dot'; // Set type for red dot badge and hide the text
      showText = false;
      break;
    case 'CO2_BEWERTUNG_A':
      return { name: 'CO2 - A', type: 'co2-a', showText: true }; // Handle CO2 badges
    case 'CO2_BEWERTUNG_B':
      return { name: 'CO2 - B', type: 'co2-b', showText: true };
    case 'CO2_BEWERTUNG_C':
      return { name: 'CO2 - C', type: 'co2-c', showText: true };
    case 'H2O_BEWERTUNG_A':
      return { name: 'H2O - A', type: 'h2o-a', showText: true }; // Handle water (H2O) badges
    case 'H2O_BEWERTUNG_B':
      return { name: 'H2O - B', type: 'h2o-b', showText: true };
    case 'H2O_BEWERTUNG_C':
      return { name: 'H2O - C', type: 'h2o-c', showText: true };
  }

  return { name, type, showText }; // Return the name, type, and text visibility for the badge
};

// Function to get the description of a badge by its ID
const getBadgeDescription = (badgeId) => {
  const badge = badges.value.find(b => b.id === badgeId); // Find the badge by its ID
  return badge && badge.description ? ` ${badge.description}` : ''; // Return the description if it exists, otherwise return an empty string
};

// Function to get the style for a meal category
const getCategoryStyle = (category) => {
  let type = 'default'; // Default category type
  let showText = true; // By default, show the category text

  // Set category style based on its name
  switch (category.toUpperCase()) {
    case 'SALATE':
      type = 'salad'; // Set type for salad category
      break;
    case 'SUPPEN':
      type = 'soup'; // Set type for soup category
      break;
    case 'ESSEN':
    case 'HAUPTGERICHTE':
      type = 'main-dish'; // Set type for main dishes
      break;
    case 'BEILAGEN':
      type = 'side-dish'; // Set type for side dishes
      break;
    case 'DESSERTS':
      type = 'dessert'; // Set type for desserts
      break;
  }

  return { type, showText }; // Return the type and text visibility for the category
};

// Function to get the text of an additive by its ID
const getAdditiveText = (additiveId) => {
  const additive = additives.value.find(a => a.id === additiveId); // Find the additive by its ID
  return additive ? additive.text : ''; // Return the text if the additive exists, otherwise return an empty string
};
</script>


<style scoped>
.menu-description {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  white-space: normal;
  word-wrap: break-word;
  overflow-y: auto;
  max-height: 150px;
}

.badge-descriptions {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.additives-info {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
  white-space: normal;
  word-wrap: break-word;
}

.additive {
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 2px 5px;
  background-color: #f0f0f0;
  border-radius: 3px;
  font-size: 0.8rem;
}

.dish-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.price {
  font-size: 1rem;
  color: #2d9a2d;
  margin-top: 5px;
}

.badges {
  display: flex;
  gap: 8px;
  margin-left: auto;
  margin-right: auto;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.category-badge {
  background-color: #007bff;
  color: white;
}

.vegan-badge {
  background-color: #2d9a2d;
  color: white;
}

.vegetarian-badge {
  background-color: #4caf50;
  color: white;
}

.green-dot-badge::before,
.yellow-dot-badge::before,
.red-dot-badge::before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

.green-dot-badge::before {
  background-color: #2d9a2d;
}

.yellow-dot-badge::before {
  background-color: #ffd700;
}

.red-dot-badge::before {
  background-color: #ff0000;
}

.green-dot-badge,
.yellow-dot-badge,
.red-dot-badge {
  background-color: transparent;
  color: #333;
  display: flex;
  align-items: center;
}

.salad-badge {
  background-color: #4CAF50;
  color: white;
}

.soup-badge {
  background-color: #FF9800;
  color: white;
}

.main-dish-badge {
  background-color: #2196F3;
  color: white;
}

.side-dish-badge {
  background-color: #9C27B0;
  color: white;
}

.dessert-badge {
  background-color: #E91E63;
  color: white;
}

.default-badge {
  background-color: #E91E63;
  color: white;
}

.co2-a-badge, .h2o-a-badge {
  background-color: #4CAF50;
  color: white;
}

.co2-b-badge, .h2o-b-badge {
  background-color: #FFC107;
  color: black;
}

.co2-c-badge, .h2o-c-badge {
  background-color: #F44336;
  color: white;
}

.badges-wrapper {
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.badges-wrapper::-webkit-scrollbar {
  display: none;
}

.meal-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meal-title {
  margin: 0;
  flex-grow: 1;
}

.favorite-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: gold;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}

.prices {
  margin-top: 10px;
  height: auto;
}
</style>
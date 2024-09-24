<template>
  <div class="favorites-section container mt-5">
    <h2 class="text-center mb-5">Your Favorite Meals</h2>
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
      <p class="lead">You don't have any favorite meals yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiService from '../services/apiService';

const favoriteMeals = ref([]);
const badges = ref([]);
const additives = ref([]);

onMounted(async () => {
  const storedFavoriteIds = JSON.parse(localStorage.getItem('favoriteMeals') || '[]');
  favoriteMeals.value = await fetchFavoriteMeals(storedFavoriteIds);
  await fetchBadges();
  await fetchAdditives();
});

const fetchFavoriteMeals = async (mealIds) => {
  const meals = [];
  for (const mealId of mealIds) {
    try {
      const meal = await apiService.getMeal(mealId);
      meals.push(meal);
    } catch (error) {
      console.error(`Error fetching meal with ID ${mealId}:`, error);
    }
  }
  return meals;
};

const removeMeal = (mealId) => {
  favoriteMeals.value = favoriteMeals.value.filter(meal => meal.id !== mealId);
  const updatedFavoriteIds = favoriteMeals.value.map(meal => meal.id);
  localStorage.setItem('favoriteMeals', JSON.stringify(updatedFavoriteIds));
};

const filteredPrices = (meal) => {
  const selectedRole = localStorage.getItem('selectedRole') || 'Studierende';
  return meal.prices.filter(priceItem => priceItem.priceType === selectedRole);
};

const fetchBadges = async () => {
  try {
    badges.value = await apiService.getBadges();
  } catch (error) {
    console.error('Error fetching badges:', error);
  }
};

const fetchAdditives = async () => {
  try {
    additives.value = await apiService.getAdditives();
  } catch (error) {
    console.error('Error fetching additives:', error);
  }
};

const getBadgeName = (badgeId) => {
  const badge = badges.value.find(b => b.id === badgeId);
  const name = badge ? badge.name : 'Unknown Badge';
  let type = 'default';
  let showText = true;

  if (name.length === 1) {
    return { name: '', type, showText: false };
  }

  switch (name.toUpperCase()) {
    case 'VEGAN':
      type = 'vegan';
      break;
    case 'VEGETARISCH':
      type = 'vegetarian';
      break;
    case 'GRÜNER AMPELPUNKT':
      type = 'green-dot';
      showText = false;
      break;
    case 'GELBER AMPELPUNKT':
      type = 'yellow-dot';
      showText = false;
      break;
    case 'ROTER AMPELPUNKT':
      type = 'red-dot';
      showText = false;
      break;
    case 'CO2_BEWERTUNG_A':
      return { name: 'CO2 - A', type: 'co2-a', showText: true };
    case 'CO2_BEWERTUNG_B':
      return { name: 'CO2 - B', type: 'co2-b', showText: true };
    case 'CO2_BEWERTUNG_C':
      return { name: 'CO2 - C', type: 'co2-c', showText: true };
    case 'H2O_BEWERTUNG_A':
      return { name: 'H2O - A', type: 'h2o-a', showText: true };
    case 'H2O_BEWERTUNG_B':
      return { name: 'H2O - B', type: 'h2o-b', showText: true };
    case 'H2O_BEWERTUNG_C':
      return { name: 'H2O - C', type: 'h2o-c', showText: true };
  }

  return { name, type, showText };
};

const getBadgeDescription = (badgeId) => {
  const badge = badges.value.find(b => b.id === badgeId);
  return badge && badge.description ? ` ${badge.description}` : '';
};

const getCategoryStyle = (category) => {
  let type = 'default';
  let showText = true;

  switch (category.toUpperCase()) {
    case 'SALATE':
      type = 'salad';
      break;
    case 'SUPPEN':
      type = 'soup';
      break;
    case 'ESSEN':
    case 'HAUPTGERICHTE':
      type = 'main-dish';
      break;
    case 'BEILAGEN':
      type = 'side-dish';
      break;
    case 'DESSERTS':
      type = 'dessert';
      break;
  }

  return { type, showText };
};

const getAdditiveText = (additiveId) => {
  const additive = additives.value.find(a => a.id === additiveId);
  return additive ? additive.text : '';
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
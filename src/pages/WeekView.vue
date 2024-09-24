<script lang="ts">
import apiService from '../services/apiService';
import { Mensa, Meal, Badges, Additive } from '../services/apiServiceTypes';

export default {
  name: 'GetMensas',
  data() {
    return {
      canteens: [] as Mensa[],
      badges: [] as Badges,
      meals: [] as Meal[],
      currentDate: new Date(),
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      selectedMenu: [] as Meal[],
      canteenId: localStorage.getItem('selectedMensa') || '655ff175136d3b580c970f80',
      favoriteMeals: JSON.parse(localStorage.getItem('favoriteMeals') || '[]') as string[],
      selectedCategory: 'ALL', // Add a new data property for the selected category
      additives: [] as Additive[],
    };
  },
  computed: {
    filteredPrices() {
      const selectedRole = localStorage.getItem('selectedRole') || 'Studierende';
      return (meal: Meal) => {
        return meal.prices.filter((priceItem: { priceType: string; }) => priceItem.priceType === selectedRole);
      };
    },
    filteredMeals() {
      if (this.selectedCategory === 'ALLES') {
        return this.selectedMenu;
      }
      return this.selectedMenu.filter(meal => meal.category.toUpperCase() === this.selectedCategory);
    },
  },
  methods: {
    fetchCanteens() {
      apiService.getMensen()
        .then((response) => { 
          this.canteens = response;
        })
        .catch((error: any) => {
          console.error(error);
        });
    },
    fetchMeals(canteenId: string) {
      const startDate = new Date().toLocaleDateString('en-CA', { year: 'numeric', day: '2-digit', month: '2-digit' }).replace(/\//g, '-');

      apiService.getAllMealsFromCanteenFromDay(canteenId, startDate)
        .then((response: Meal[]) => { 
          this.meals = response;
          console.log(this.meals[0]);
        })
        .catch((error: any) => {
          console.error(error);
        });
    },
    formatDate(date: Date): string {
      return date.toISOString().split('T')[0];
    },
    getStartOfWeek(date: Date): Date {
      const currentDay = date.getDay();
      const distanceFromMonday = currentDay === 0 ? 6 : currentDay - 1;
      const monday = new Date(date);
      monday.setDate(date.getDate() - distanceFromMonday);
      return monday;
    },
    getDateForDay(dayOffset: number): Date {
      const monday = this.getStartOfWeek(this.currentDate);
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + dayOffset);
      return targetDate;
    },
    changeDay(offset: number) {
      this.currentDate.setDate(this.currentDate.getDate() + offset);
      const dayOffset = this.currentDate.getDay() - 1;
      this.updateMenuForDay(dayOffset);
      this.scrollToDay(dayOffset);
    },
    handleDayClick(dayOffset: number) {
      this.currentDate = this.getDateForDay(dayOffset);
      this.updateMenuForDay(dayOffset);
      this.scrollToDay(dayOffset);
    },
    isSelectedDay(dayOffset: number): boolean {
      const targetDate = this.getDateForDay(dayOffset);
      return targetDate.toDateString() === this.currentDate.toDateString();
    },
    async updateMenuForDay(dayOffset: number) {
      const targetDate = this.formatDate(this.getDateForDay(dayOffset));

      try {
        const meals: Meal[] = await apiService.getAllMealsFromCanteenFromDay(this.canteenId, targetDate);
        
        // Filter meals based on diet preferences
        const dietPreferencesMeat = localStorage.getItem('dietPreferencesMeat') === 'true';
        const dietPreferencesVegan = localStorage.getItem('dietPreferencesVegan') === 'true';
        const dietPreferencesVegetarian = localStorage.getItem('dietPreferencesVegetarian') === 'true';

        this.selectedMenu = meals.filter(meal => {
          const badges = meal.badges.map(badgeId => this.getBadgeName(badgeId).type);
          if (dietPreferencesMeat) {
            return true;
          }
          if (dietPreferencesVegan && badges.includes('vegan')) {
            return true;
          }
          if (dietPreferencesVegetarian && badges.includes('vegetarian')) {
            return true;
          }
          return false;
        });

        // Fetch additives if not already loaded
        if (this.additives.length === 0) {
          await this.fetchAdditives();
        }
      } catch (error) {
        console.error(`Error fetching meals:`, error);
        this.selectedMenu = [];
      }
    },
    fetchBadges() {
      apiService.getBadges()
        .then((badges: Badges) => {
          this.badges = badges;
        })
        .catch((error: any) => {
          console.error(error);
        });
    },
    getBadgeName(badgeId: string): { name: string; type: string; showText: boolean } {
      const badge = this.badges.find(b => b.id === badgeId);
      const name = badge ? badge.name : 'Unknown Badge';
      let type = 'default';
      let showText = true;

      // Skip badges with names that are only one letter
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
    },
    getBadgeDescription(badgeId: string): string {
      const badge = this.badges.find(b => b.id === badgeId);
      return badge && badge.description ? ` ${badge.description}` : '';
    },
    getCategoryStyle(category: string): { type: string; showText: boolean } {
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
    },
    scrollToDay(dayOffset: number) {
      const dayElement = this.$el.querySelectorAll('.day')[dayOffset];
      if (dayElement) {
        dayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    toggleFavorite(mealId: string) {
      const index = this.favoriteMeals.indexOf(mealId);
      if (index === -1) {
        this.favoriteMeals.push(mealId);
      } else {
        this.favoriteMeals.splice(index, 1);
      }
      localStorage.setItem('favoriteMeals', JSON.stringify(this.favoriteMeals));
    },
    isFavorite(mealId: string): boolean {
      return this.favoriteMeals.includes(mealId);
    },
    selectCategory(category: string) {
      this.selectedCategory = category;
    },
    async fetchAdditives() {
      try {
        this.additives = await apiService.getAdditives();
      } catch (error) {
        console.error('Error fetching additives:', error);
      }
    },
    getAdditiveText(additiveId: string): string {
      for (const additive of this.additives) {
        console.log(additive);
        if (additive.id === additiveId) {
          return additive.text;
        }
      }
      return '';
    },
  },
  created() {
    // Check and set diet preferences if not already set
    if (localStorage.getItem('dietPreferencesMeat') === null) {
      localStorage.setItem('dietPreferencesMeat', 'true');
    }
    if (localStorage.getItem('dietPreferencesVegan') === null) {
      localStorage.setItem('dietPreferencesVegan', 'true');
    }
    if (localStorage.getItem('dietPreferencesVegetarian') === null) {
      localStorage.setItem('dietPreferencesVegetarian', 'true');
    }

    this.fetchCanteens();
    this.updateMenuForDay(0);
    this.fetchBadges();
    this.fetchAdditives();
  },
};
</script>



<template>
  <div class="menu-container container">
    <div class="navigation">
      <button id="prev" class="arrow-button" @click="changeDay(-1)">
        <span class="arrow">←</span>
      </button>
      <div class="days-container">
        <div class="days">
          <div v-for="(day, index) in daysOfWeek" :key="day" class="day" :class="{ selected: isSelectedDay(index) }"
            @click="handleDayClick(index)">
            <p class="day-name">{{ day.toUpperCase() }}</p>
            <p class="date">{{ formatDate(getDateForDay(index)) }}</p>
          </div>
        </div>
      </div>
      <button id="next" class="arrow-button" @click="changeDay(1)">
        <span class="arrow">→</span>
      </button>
    </div>

    <!-- Category filter buttons -->
    <div class="category-filters">
      <button v-for="category in ['ALLES', 'SALATE', 'ESSEN', 'BEILAGEN', 'DESSERTS']" :key="category"
        :class="{ active: selectedCategory === category }" @click="selectCategory(category)">
        {{ category }}
      </button>
    </div>

    <div class="content">
      <!-- Page content goes here -->
    </div>

    <!-- Menu for the selected day -->
    <div class="menu container">
      <ul class="menu-list container">
        <li v-for="meal in filteredMeals" :key="meal.id" class="menu-item">
          <div class="card">
            <div class="card-body">
              <!-- Mock image for now -->
              <!-- <img :src="meal.image || 'https://via.placeholder.com/100'" alt="Dish Image" class="menu-img"> -->
              <div class="menu-description">
                <div class="dish-header">
                  <div class="meal-header">
                    <h4 class="meal-title">
                      {{ meal.name }}
                    </h4>
                    <button @click.stop="toggleFavorite(meal.id)" class="favorite-button">
                      <span v-if="isFavorite(meal.id)">★</span>
                      <span v-else>☆</span>
                    </button>
                  </div>
                  <!-- Move badges-wrapper here -->
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
                    <!-- Add additives information -->
                    <p class="additives-info">
                      Allergene: 
                      <span v-for="additiveId in meal.additives" :key="additiveId" class="additive">
                        {{ getAdditiveText(additiveId) }}
                      </span>
                    </p>
                  </div>
                  <!-- Prices -->
                  <div class="prices">
                    <span v-for="priceItem in filteredPrices(meal)" :key="priceItem.priceType" class="price">
                      {{ priceItem.priceType }}: {{ priceItem.price.toFixed(2) }}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>


.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.days-container {
  flex-grow: 1;
  overflow: hidden;
}

.days {
  display: flex;
  justify-content: center; /* Center the days */
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.days::-webkit-scrollbar {
  display: none; /* WebKit */
}

.arrow-button {
  background-color: #007bff;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  flex-shrink: 0; /* Prevent shrinking */
}

.arrow-button:hover {
  background-color: #0056b3;
}

.day {
  flex: 0 0 auto;
  min-width: 80px;
  margin: 0 5px;
  text-align: center;
  padding: 10px;
  color: gray;
  transition: color 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
  border-radius: 8px;
}

.day:hover {
  background-color: #e9ecef;
}

.selected {
  color: white; /* Ensure text color is white */
  font-weight: bold;
  background-color: #007bff;
}

.selected .date {
  color: white; /* Ensure date color is white */
}

.date {
  font-size: 0.9rem; /* Adjusted font size */
  color: gray;
}

.day-name {
  font-size: 1rem; /* Adjusted font size */
  margin-bottom: 5px;
}

.content {
  margin-top: 20px; /* Add margin to push content below the navbar */
}

.menu {
  text-align: center;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  width: 100%; /* Ensure the menu takes full width */
  max-width: 800px; /* Set a max-width to center the menu */
  margin: 0 auto; /* Center the menu horizontally */
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
  white-space: normal; /* Allow text to wrap */
  word-wrap: break-word; /* Break long words if necessary */
  overflow-y: auto;
  max-height: 150px;
}

.badge-descriptions {
  white-space: pre-wrap; /* Preserve spaces and line breaks, but allow wrapping */
  word-wrap: break-word; /* Break long words if necessary */
}

.additives-info {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
  white-space: normal; /* Allow text to wrap */
  word-wrap: break-word; /* Break long words if necessary */
}

.additive {
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 5px; /* Add some bottom margin for wrapped items */
  padding: 2px 5px;
  background-color: #f0f0f0;
  border-radius: 3px;
  font-size: 0.8rem;
}

.scrollable-container {
  overflow-x: auto; /* Enable horizontal scrolling */
  white-space: nowrap; /* Prevent text from wrapping */
  display: flex; /* Use flexbox to align items */
  align-items: center; /* Center items vertically */
}

.meal-name {  
  display: inline-block; /* Ensure the meal name is inline for scrolling */
}

.dish-header {
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: flex-start; /* Align children to the start of the container */
  width: 100%;
}

.price {
  font-size: 1rem;
  color: #2d9a2d;
  margin-top: 5px;
}

.ingredients {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badges {
  display: flex;
  gap: 8px;
  margin-left: auto;
  margin-right: aut; /* Add some space between the meal name and badges */
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



.menu-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.menu-item {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.card {
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  height: auto; /* Allow the card to expand */
  display: flex;
  flex-direction: column;
}

.card-body {
  flex-grow: 1; /* Allow the card body to grow */
  display: flex;
  flex-direction: column;
}

.menu-description {
  flex-grow: 1; /* Allow the description to grow */
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align content to the top */
  white-space: normal;
  word-wrap: break-word;
  overflow-y: visible; /* Remove scroll, allow content to expand */
  max-height: none; /* Remove max-height restriction */
}

.vegan-badge {
  background-color: #2d9a2d;
  color: white;
}

.vegetarian-badge {
  background-color: #4caf50;
  color: white;
}

.ingredient-badge {
  background-color: #f0f0f0;
  color: #333;
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
  /* Green */
  color: white;
}

.soup-badge {
  background-color: #FF9800;
  /* Orange */
  color: white;
}

.main-dish-badge {
  background-color: #2196F3;
  /* Blue */
  color: white;
}

.side-dish-badge {
  background-color: #9C27B0;
  /* Purple */
  color: white;
}

.dessert-badge {
  background-color: #E91E63;
  /* Pink */
  color: white;
}
.default-badge {
  background-color: #E91E63;
  /* Pink */
  color: white;
}

.badge-item {
  /* Styles for non-category badges */
}

.category-badge {
  /* General styles for category badges */
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.co2-a-badge, .h2o-a-badge {
  background-color: #4CAF50; /* Green */
  color: white;
}

.co2-b-badge, .h2o-b-badge {
  background-color: #FFC107; /* Amber */
  color: black;
}

.co2-c-badge, .h2o-c-badge {
  background-color: #F44336; /* Red */
  color: white;
}

.co2-a-badge, .h2o-a-badge {
  background-color: #4CAF50; /* Green */
  color: white;
}

.co2-b-badge, .h2o-b-badge {
  background-color: #FFC107; /* Amber */
  color: black;
}

.co2-c-badge, .h2o-c-badge {
  background-color: #F44336; /* Red */
  color: white;
}

.badges-wrapper {
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
}

.badges {
  display: inline-flex;
  gap: 8px;
}

/* Hide scrollbar for Webkit browsers (Chrome, Safari) */
.badges-wrapper::-webkit-scrollbar {
  display: none;
}

.prices {
  margin-top: 10px; /* Add some space between the description and prices */
  height: auto; /* Ensure the height adjusts to its content */
}

/* Responsive styles */
@media (max-width: 600px) {
  .arrow-button {
    font-size: 1rem;
    padding: 8px;
  }

  .day-name {
    font-size: 0.9rem; /* Adjusted font size for mobile */
  }

  .date {
    font-size: 0.8rem;
  }
}

.favorite-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: gold;
  margin-left: 10px;
}

.category-filters {
  display: flex;
  justify-content: center;
  margin: 10px 0;
  flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
  gap: 5px; /* Add gap between buttons */
}

.category-filters button {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 8px 12px; /* Reduce padding for smaller screens */
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 8px;
  font-size: 0.9rem; /* Slightly reduce font size */
  white-space: nowrap; /* Prevent text from wrapping inside buttons */
  flex-grow: 1; /* Allow buttons to grow and fill available space */
  max-width: calc(50% - 5px); /* Set max-width to 50% minus gap for 2 columns on very small screens */
}

.category-filters button.active {
  background-color: #007bff;
  color: white;
}

.category-filters button:hover {
  background-color: #e9ecef;
}

/* Media query for larger mobile devices and tablets */
@media (min-width: 480px) {
  .category-filters button {
    max-width: none; /* Remove max-width constraint */
    flex-grow: 0; /* Don't allow buttons to grow */
  }
}

.category-filters button {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 8px 12px; /* Reduce padding for smaller screens */
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 8px;
  font-size: 0.9rem; /* Slightly reduce font size */
  white-space: nowrap; /* Prevent text from wrapping inside buttons */
  flex-grow: 1; /* Allow buttons to grow and fill available space */
  max-width: calc(50% - 5px); /* Set max-width to 50% minus gap for 2 columns on very small screens */
}

.category-filters button.active {
  background-color: #007bff;
  color: white;
}

.category-filters button:hover {
  background-color: #e9ecef;
}

/* Media query for larger mobile devices and tablets */
@media (min-width: 480px) {
  .category-filters button {
    max-width: none; /* Remove max-width constraint */
    flex-grow: 0; /* Don't allow buttons to grow */
  }
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

.category-filters button:hover {
  background-color: #e9ecef;
}
</style>

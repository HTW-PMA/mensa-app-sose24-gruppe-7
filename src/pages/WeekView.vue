<script lang="ts">
import apiService from '../services/apiService';
import { Mensa, Meal, Badges, Additive } from '../services/apiServiceTypes';
import Legend from '../components/Legend.vue';

export default {
  name: 'GetMensas',
  components: {
    Legend, // Register the Legend component here
  },
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
      selectedCategory: 'ALLES', // Set 'ALLES' as default selected category
      additives: [] as Additive[],
      isLegendVisible: false, // New data property for controlling sidebar visibility
      noMealsAvailableMessage: '', // Property to hold the no meals message
    };
  },
  computed: {
    filteredPrices() {
      const selectedRole = localStorage.getItem('selectedRole') || 'Studierende';
      return (meal: Meal) => {
        return meal.prices.filter((priceItem: { priceType: string }) => priceItem.priceType === selectedRole);
      };
    },
    filteredMeals() {
      if (this.selectedCategory === 'ALLES') {
        return this.selectedMenu; // Show all meals when 'ALLES' is selected
      }
      return this.selectedMenu.filter((meal) => meal.category.toUpperCase() === this.selectedCategory);
    },
  },
  methods: {
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
        default:
          type = 'default'; // Fallback style if the category doesn't match
      }

      return { type, showText };
    },

    toggleLegend() {
      this.isLegendVisible = !this.isLegendVisible; // Toggle the legend visibility
    },
    fetchCanteens() {
      apiService
        .getMensen()
        .then((response) => {
          this.canteens = response;
        })
        .catch((error: any) => {
          console.error(error);
        });
    },
    fetchMeals(canteenId: string) {
      const startDate = new Date()
        .toLocaleDateString('en-CA', {
          year: 'numeric',
          day: '2-digit',
          month: '2-digit',
        })
        .replace(/\//g, '-');

      apiService
        .getAllMealsFromCanteenFromDay(canteenId, startDate)
        .then((response: Meal[]) => {
          this.meals = response;
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

        this.selectedMenu = meals.filter((meal) => {
          const badges = meal.badges.map((badgeId) => this.getBadgeName(badgeId).type);
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

        // If no meals are available for the selected day, show a message
        if (this.selectedMenu.length === 0) {
          this.noMealsAvailableMessage = "Für diesen Tag gibt es keinen Speiseplan.";
        } else {
          this.noMealsAvailableMessage = "";
        }

        // Fetch additives if not already loaded
        if (this.additives.length === 0) {
          await this.fetchAdditives();
        }
      } catch (error) {
        console.error(`Error fetching meals:`, error);
        this.selectedMenu = [];
        this.noMealsAvailableMessage = "Für diesen Tag gibt es keinen Speiseplan.";
      }
    },
    fetchBadges() {
      apiService
        .getBadges()
        .then((badges: Badges) => {
          this.badges = badges;
        })
        .catch((error: any) => {
          console.error(error);
        });
    },
    getImageForCategory(category: string): string {
      switch (category.toUpperCase()) {
        case 'SALATE':
          return new URL('@/assets/salad.jpg', import.meta.url).href;
        case 'ESSEN':
          return new URL('@/assets/main_dish.jpg', import.meta.url).href;
        case 'BEILAGEN':
          return new URL('@/assets/side_dish.jpg', import.meta.url).href;
        case 'DESSERTS':
          return new URL('@/assets/dessert.jpg', import.meta.url).href;
        case 'SUPPEN':
          return new URL('@/assets/soup.jpg', import.meta.url).href;
        default:
          return new URL('@/assets/starter_dish.jpg', import.meta.url).href; // Fallback image
      }
    },
    getBadgeName(badgeId: string): { name: string; type: string; showText: boolean } {
      const badge = this.badges.find((b) => b.id === badgeId);
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
    getAdditiveText(additiveId: string): string {
      for (const additive of this.additives) {
        if (additive.id === additiveId) {
          return additive.text;
        }
      }
      return '';
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
    scrollToDay(dayOffset: number) {
      const dayElements = this.$refs.dayElements as HTMLElement[];
      if (dayElements && dayElements[dayOffset]) {
        dayElements[dayOffset].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    async fetchAdditives() {
      try {
        this.additives = await apiService.getAdditives();
      } catch (error) {
        console.error('Error fetching additives:', error);
      }
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
  <div class="container">
    <div class="navigation-wrapper my-3">
      <div class="navigation">
        <button id="prev" class="arrow-button btn btn-primary btn-sm" @click="changeDay(-1)">
          <span class="arrow">←</span>
        </button>
        <div class="days-container">
          <div class="days">
            <div
              v-for="(day, index) in daysOfWeek"
              :key="day"
              ref="dayElements"
              class="day"
              :class="{ selected: isSelectedDay(index) }"
              @click="handleDayClick(index)"
            >
              <p class="day-name">{{ day.toUpperCase() }}</p>
              <p class="date">{{ formatDate(getDateForDay(index)) }}</p>
            </div>
          </div>
        </div>
        <button id="next" class="arrow-button btn btn-primary btn-sm" @click="changeDay(1)">
          <span class="arrow">→</span>
        </button>
      </div>
    </div>

    <!-- Category filter buttons -->
    <div class="category-filters text-center my-2">
      <button
        v-for="category in ['ALLES', 'SALATE', 'ESSEN', 'BEILAGEN', 'DESSERTS']"
        :key="category"
        :class="['btn', 'btn-outline-primary', 'btn-sm', { active: selectedCategory === category }]"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>
    </div>

    <!-- Button to toggle the legend -->
    <div class="text-center mb-3">
      <button
        class="btn btn-outline-primary btn-sm"
        :class="{ active: isLegendVisible }"
        @click="toggleLegend"
      >
        {{ isLegendVisible ? 'Hide Legend' : 'Show Legend' }}
      </button>
    </div>

    <!-- Content and legend layout using Bootstrap grid -->
    <div class="row">
      <div class="col-lg-9">
        <div class="menu container">
          <ul class="menu-list container" v-if="filteredMeals.length > 0">
            <li v-for="meal in filteredMeals" :key="meal.id" class="menu-item">
              <div class="card">
                <div class="card-body d-flex">
                  <!-- Image based on meal category -->
                  <div class="menu-img-container">
                    <img :src="getImageForCategory(meal.category)" alt="Meal Image" class="menu-img" />
                  </div>
                  <div class="menu-content">
                    <div class="meal-header">
                      <h4 class="meal-title">{{ meal.name }}</h4>
                      <button @click.stop="toggleFavorite(meal.id)" class="favorite-button btn btn-link btn-sm">
                        <span v-if="isFavorite(meal.id)">★</span>
                        <span v-else>☆</span>
                      </button>
                    </div>
                    <!-- Badges and category -->
                    <div class="badges-wrapper">
                      <div class="badges">
                        <span
                          v-for="badgeId in meal.badges"
                          :key="badgeId"
                          :class="['badge', 'badge-item', `${getBadgeName(badgeId).type}-badge`]"
                        >
                          <span v-if="getBadgeName(badgeId).showText">{{ getBadgeName(badgeId).name }}</span>
                        </span>
                        <span :class="['badge', 'category-badge', `${getCategoryStyle(meal.category).type}-badge`]">
                          {{ meal.category }}
                        </span>
                      </div>
                    </div>
                    <!-- Prices and additives -->
                    <div class="menu-description">
                      <p class="additives-info">
                        Allergene:
                        <span v-for="additiveId in meal.additives" :key="additiveId" class="additive">
                          {{ getAdditiveText(additiveId) }}
                        </span>
                      </p>
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

          <!-- If no meals are available, display the message -->
          <div v-else class="no-meals-message text-center">
            <p>{{ noMealsAvailableMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Legend component in a Bootstrap column -->
      <div v-if="isLegendVisible" class="col-lg-3">
        <Legend />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style updates for active category button */
.category-filters button.active {
  background-color: #007bff;
  color: white;
}

.menu-container {
  display: flex;
  flex-direction: column;
}

.content-area {
  display: flex;
  position: relative;
}

.menu-list-container {
  flex: 1;
}

.legend-panel {
  position: fixed;
  right: -300px;
  top: 0;
  bottom: 0;
  width: 250px;
  transition: right 0.3s ease;
  padding: 10px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow-y: auto;
  z-index: 1000;
}

.legend-panel.visible {
  right: 0;
}

.toggle-legend-btn {
  margin: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.toggle-legend-btn:hover {
  background-color: #0056b3;
}

.navigation-wrapper {
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.days-container {
  flex-grow: 1;
  overflow: hidden;
  margin: 0 10px;
}

.days {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.days::-webkit-scrollbar {
  display: none;
}

.arrow-button {
  background-color: #007bff;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
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
  color: #007bff;
  transition: color 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid #007bff;
}

.day:hover {
  background-color: #e9ecef;
}

.day.selected {
  color: white;
  font-weight: bold;
  background-color: #007bff;
}

.day.selected:hover {
  color: #007bff;
  background-color: #e9ecef;
}

.day .date {
  font-size: 0.9rem;
  color: inherit;
}

.date {
  font-size: 0.9rem;
  color: gray;
}

.day-name {
  font-size: 1rem;
  margin-bottom: 5px;
}

.content {
  margin-top: 20px;
}

.menu {
  text-align: center;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
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

.scrollable-container {
  overflow-x: auto;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.meal-name {
  display: inline-block;
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
  margin-right: auto;
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
  height: auto;
  display: flex;
  flex-direction: column;
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.menu-description {
  flex-grow: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  white-space: normal;
  word-wrap: break-word;
  overflow-y: visible;
  max-height: none;
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

.badge-item {
  /* Styles for non-category badges */
}

.category-badge {
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.co2-a-badge,
.h2o-a-badge {
  background-color: #4CAF50;
  color: white;
}

.co2-b-badge,
.h2o-b-badge {
  background-color: #FFC107;
  color: black;
}

.co2-c-badge,
.h2o-c-badge {
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

.badges {
  display: inline-flex;
  gap: 8px;
}

.badges-wrapper::-webkit-scrollbar {
  display: none;
}

.prices {
  margin-top: 10px;
  height: auto;
}

/* Responsive styles */
@media (max-width: 600px) {
  .arrow-button {
    font-size: 1rem;
    padding: 8px;
  }

  .day-name {
    font-size: 0.9rem;
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
  flex-wrap: wrap;
  gap: 5px;
}

.category-filters button {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 8px;
  font-size: 0.9rem;
  white-space: nowrap;
  flex-grow: 1;
  max-width: calc(50% - 5px);
}

.category-filters button.active {
  background-color: #007bff;
  color: white;
}

.category-filters button:hover {
  background-color: #e9ecef;
}

@media (min-width: 480px) {
  .category-filters button {
    max-width: none;
    flex-grow: 0;
  }
}

@media (max-width: 576px) {
  .navigation-wrapper {
    padding: 5px;
  }

  .arrow-button {
    font-size: 1rem;
    padding: 6px;
    width: 32px;
    height: 32px;
  }

  .days-container {
    margin: 0 5px;
  }

  .day {
    min-width: 60px;
    padding: 5px;
  }

  .day-name {
    font-size: 0.8rem;
  }

  .date {
    font-size: 0.7rem;
  }
}

.card-body {
  display: flex;
  padding: 1rem;
}

.menu-img-container {
  flex: 0 0 auto;
  margin-right: 1rem;
}

.menu-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.meal-title {
  margin: 0;
  font-size: 1.2rem;
}

.favorite-button {
  padding: 0;
  font-size: 1.5rem;
}

.badges-wrapper {
  margin-bottom: 0.5rem;
}

.menu-description {
  font-size: 0.9rem;
}

.additives-info {
  margin-bottom: 0.5rem;
}

.prices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 576px) {
  .card-body {
    flex-direction: column;
  }

  .menu-img-container {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .menu-img {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
}

.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
}

.btn-outline-primary:hover {
  color: #007bff;
  background-color: #e9ecef;
}

.btn-outline-primary.active {
  color: white;
  background-color: #007bff;
}

.btn-outline-primary.active:hover {
  color: #007bff;
  background-color: #e9ecef;
}
</style>

<script lang="ts">
import apiService from '../services/apiService.ts';
import { Mensa, Meal, Badges } from '../services/apiServiceTypes.ts';

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
      canteenId: localStorage.getItem('selectedMensa') || '',  // Dynamische Mensa aus Settings abrufen
    };
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
    },

    handleDayClick(dayOffset: number) {
      this.currentDate = this.getDateForDay(dayOffset);
      this.updateMenuForDay(dayOffset);
    },

    isSelectedDay(dayOffset: number): boolean {
      const targetDate = this.getDateForDay(dayOffset);
      return targetDate.toDateString() === this.currentDate.toDateString();
    },

    updateMenuForDay(dayOffset: number) {
      const targetDate = this.formatDate(this.getDateForDay(dayOffset));

      // Verwende die dynamische canteenId, die aus Local Storage geladen wird
      apiService.getAllMealsFromCanteenFromDay(this.canteenId, targetDate)
        .then((meals: Meal[]) => {
          this.selectedMenu = meals;
        })
        .catch((error: any) => {
          console.error(`Error fetching meals:`, error);
          this.selectedMenu = [];
        });
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
  },

  created() {
    this.fetchCanteens();
    this.updateMenuForDay(0);
    this.fetchBadges();
  },
};
</script>

<template>
  <div class="menu-container">
    <div class="navigation">
      <button id="prev" class="arrow-button" @click="changeDay(-1)">←</button>
      <div class="days">
        <div v-for="(day, index) in daysOfWeek" :key="day" class="day" :class="{ selected: isSelectedDay(index) }"
          @click="handleDayClick(index)">
          <p>{{ day.toUpperCase() }}</p>
          <p class="date">{{ formatDate(getDateForDay(index)) }}</p>
        </div>
      </div>
      <button id="next" class="arrow-button" @click="changeDay(1)">→</button>
    </div>

    <!-- Filter Dropdown -->
    <div class="filter-section">
      <label for="categoryFilter">Filter nach Kategorie:</label>
      <select id="categoryFilter" v-model="selectedCategory" @change="filterMealsByCategory">
        <option value="">Alle Kategorien</option>
        <option value="Essen">Essen</option>
        <option value="Salate">Salat</option>
        <option value="Suppen">Suppe</option>
        <option value="Beilagen">Beilagen</option>
        <option value="Desserts">Desserts</option>
      </select>
    </div>

    <!-- Menu for the selected day -->
    <div class="menu">
      <ul class="menu-list">
        <li v-for="meal in filteredMenu" :key="meal.id" class="menu-item">
          <div class="card">
            <div class="card-body">
              <router-link :to="{ name: 'DishDetail', params: { id: meal.id } }" class="menu-link">
                <div class="menu-description">
                  <div class="dish-header">
                    <h4>{{ meal.name }}</h4>
                    <div class="badges">
                      <span v-for="badgeId in meal.badges" :key="badgeId"
                        :class="['badge', 'badge-item', `${getBadgeName(badgeId).type}-badge`]">
                        <span v-if="getBadgeName(badgeId).showText">{{ getBadgeName(badgeId).name }}</span>
                      </span>

                      <span :class="['badge', 'category-badge', `${getCategoryStyle(meal.category).type}-badge`]">
                        {{ meal.category }}
                      </span>
                      <span v-for="category in meal.category" :key="category"
                        :class="['badge', 'category-badge', `${getCategoryStyle(category).type}-badge`]">
                        {{ category }}
                      </span>
                    </div>
                  </div>
                  <p>
                    <template v-for="badgeId in meal.badges" :key="badgeId">
                      {{ getBadgeDescription(badgeId) }}
                    </template>
                  </p>
                  <!-- Prices -->
                  <div class="prices">
                    <span v-for="priceItem in meal.prices" :key="priceItem.priceType" class="price">
                      {{ priceItem.priceType }}: {{ priceItem.price.toFixed(2) }}€
                    </span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


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
  cursor: pointer;
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
  width: 100%;
  flex-wrap: wrap;
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

.ingredient-badge {
  background-color: #f0f0f0;
  color: #333;
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
  /* Adjust this value as needed */
  margin-bottom: 20px;
}

.card {
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
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

</style>

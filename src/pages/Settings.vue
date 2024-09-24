<template>
  <div class="container mt-5">
    <!-- Settings Section in a Bootstrap Card -->
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-primary text-white">
        Einstellungen
      </div>
      <div class="card-body">
        <!-- Role Selection -->
        <div class="mb-3">
          <label for="roleSelect" class="form-label text-start">Rolle</label>
          <select class="form-select" id="roleSelect" v-model="selectedRole">
            <option>Gäste</option>
            <option>Studierende</option>
            <option>Angestellte</option>
          </select>
        </div>

        <!-- University Selection -->
        <div class="mb-3">
          <label for="universitySelect" class="form-label text-start">Universität</label>
          <select class="form-select" id="universitySelect" v-model="selectedUniversity" @change="filterCanteensByUniversity">
            <option value="">Alle Universitäten</option>
            <option v-for="university in universities" :key="university">{{ university }}</option>
          </select>
        </div>

        <!-- Mensa Selection with Pin Button -->
        <div class="mb-3 form-group">
          <label for="mensaSelect" class="form-label text-start">Mensa</label>
          <div class="input-group">
            <select class="form-select" id="mensaSelect" v-model="selectedMensa">
              <option v-for="mensa in mensas" :key="mensa.name">{{ mensa.name }}</option>
            </select>
            <!-- Pin button for nearest cafeteria -->
            <button class="btn btn-outline-primary" @click="findNearestCafeteria">
              📍
            </button>
          </div>
        </div>

        <!-- Diet Preference with Checkboxes -->
        <div class="mb-3">
          <label class="form-label text-start">Ernährungspräferenzen</label>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="meatCheck" v-model="dietPreferences.meat">
            <label class="form-check-label" for="meatCheck">Fleischgerichte</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="vegetarianCheck" v-model="dietPreferences.vegetarian">
            <label class="form-check-label" for="vegetarianCheck">Vegetarische Gerichte</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="veganCheck" v-model="dietPreferences.vegan">
            <label class="form-check-label" for="veganCheck">Vegane Gerichte</label>
          </div>
        </div>

        <!-- Save Button -->
        <button class="btn btn-success mt-3" @click="saveSelection">Speichern</button>
      </div>
    </div>

    <!-- Student Credit Balance Section in a Bootstrap Card -->
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        Kontostand der Mensakarte
      </div>
      <div class="card-body">
        <h5 class="card-title">Kontostand: {{ balance }} €</h5>

        <!-- Form for entering the initial balance -->
        <div v-if="shouldShowInitialBalanceInput">
          <p class="card-text">Bitte geben Sie Ihren aktuellen Mensakartenguthaben ein:</p>
          <input v-model.number="initialBalance" type="number" class="form-control" placeholder="Guthaben eingeben (z.B. 200)">
          <button @click="setInitialBalance" class="btn btn-primary mt-3">Bestätigen</button>
        </div>

        <!-- Controls for adjusting the balance -->
        <div v-else>
          <p class="card-text">Geld aufladen oder abziehen:</p>
          <input v-model.number="transactionAmount" type="number" class="form-control" placeholder="Betrag eingeben (z.B. 10)">
          <div class="btn-group mt-3">
            <button @click="addMoney" class="btn btn-outline-success">Hinzufügen</button>
            <button @click="deductMoney" class="btn btn-outline-danger">Abziehen</button>
          </div>
        </div>
      </div>
      <div class="card-footer text-muted">
        {{ currentTime }}
      </div>
    </div>
  </div>
</template>



<script>
import canteens from '../../canteen.json'; 

export default {
  data() {
    return {
      selectedRole: localStorage.getItem('selectedRole') || 'Studierende',  // Load role from Local Storage 
      selectedUniversity: localStorage.getItem('selectedUniversity') || '',  // Load universities from Local Storage
      selectedMensa: localStorage.getItem('selectedMensa') || '',  // Load canteens from Local Storage
      universities: [], 
      mensas: [], 
      allMensas: [], 
      dietPreferences: {
        meat: localStorage.getItem('dietPreferencesMeat') !== null ? JSON.parse(localStorage.getItem('dietPreferencesMeat')) : false,
        vegetarian: localStorage.getItem('dietPreferencesVegetarian') !== null ? JSON.parse(localStorage.getItem('dietPreferencesVegetarian')) : false,
        vegan: localStorage.getItem('dietPreferencesVegan') !== null ? JSON.parse(localStorage.getItem('dietPreferencesVegan')) : false
      },
      balance: parseFloat(localStorage.getItem('selectedBalance')) || 0,  // Load balance from Local Storage
      transactionAmount: 0,
      currentTime: new Date().toLocaleTimeString()
    };
  },
  methods: {
    saveSelection() {
      // Save selection in Local Storage
      localStorage.setItem('selectedRole', this.selectedRole);
      localStorage.setItem('selectedUniversity', this.selectedUniversity);
      localStorage.setItem('selectedMensa', this.selectedMensa);
      localStorage.setItem('selectedBalance', this.balance);

      // Save preferences in Local Storage
      localStorage.setItem('dietPreferencesMeat', JSON.stringify(this.dietPreferences.meat));
      localStorage.setItem('dietPreferencesVegetarian', JSON.stringify(this.dietPreferences.vegetarian));
      localStorage.setItem('dietPreferencesVegan', JSON.stringify(this.dietPreferences.vegan));
    },
    setInitialBalance() {
      if (this.balance >= 0) {
        this.saveSelection(); // Save balance
      } else {
        alert('Das Guthaben darf nicht negativ sein');
      }
    },
    addMoney() {
      if (this.transactionAmount > 0) {
        this.balance += this.transactionAmount;
        this.saveSelection(); // Save balance
      } else {
        alert('Bitte einen gültigen Betrag eingeben');
      }
    },
    deductMoney() {
      if (this.transactionAmount > 0 && this.transactionAmount <= this.balance) {
        this.balance -= this.transactionAmount;
        this.saveSelection(); // Save balance
      } else {
        alert('Bitte einen gültigen Betrag eingeben');
      }
    },
    findNearestCafeteria() {
      alert('Nächste Mensa wird gesucht...');
    },
    extractData() {
  
      const universitySet = new Set();
      canteens.forEach(canteen => {
        canteen.universities.forEach(uni => universitySet.add(uni));
      });
      this.universities = Array.from(universitySet); 

  
      this.allMensas = canteens.map(canteen => ({
        name: canteen.name,
        universities: canteen.universities
      }));

      this.filterCanteensByUniversity(); 
    },
    filterCanteensByUniversity() {
      if (this.selectedUniversity) {
        // Filter canteens based on selected university 
        this.mensas = this.allMensas.filter(mensa =>
          mensa.universities.includes(this.selectedUniversity)
        );
      } else {
        // Show all canteens when nothing is selected
        this.mensas = this.allMensas;
      }
      this.saveSelection(); 
    }
  },
  computed: {
    shouldShowInitialBalanceInput() {
      // Show initial Balance only if the balance equals 0
      return this.balance === 0;
    }
  },
  watch: {
    // Watchers for automated saving of changes
    selectedRole(newValue) {
      this.saveSelection();
    },
    selectedUniversity(newValue) {
      this.saveSelection();
    },
    selectedMensa(newValue) {
      this.saveSelection();
    },
    dietPreferences: {
      deep: true, 
      handler(newValue) {
        this.saveSelection();
      }
    }
  },
  mounted() {
    this.extractData();
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 1000);
  }
};

</script>

<style scoped>
.container {
  max-width: 600px;
}

.card {
  margin-top: 20px;
  border-radius: 12px; 
}

.card-header {
  font-weight: bold;
}

.btn {
  border-radius: 25px; 
}

.form-select, .form-control {
  border-radius: 8px;
  padding: 10px;
}

.btn-outline-success, .btn-outline-danger {
  padding: 10px 20px;
}

.card-footer {
  font-size: 0.9rem;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); 
}


.form-label {
  display: block;
  text-align: left;
  font-weight: bold;
}

.ms-2 {
  margin-left: 0.5rem; 
}
</style>

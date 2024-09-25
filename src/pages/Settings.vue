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
        <div class="mb-3">
          <label for="mensaSelect" class="form-label text-start">Mensa</label>
          <MensaSelector v-model:selectedMensa="selectedMensa" />
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
        <div class="mb-3">
          <button @click="saveSettings" class="btn btn-success">Einstellungen speichern</button>
        </div>
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
import MensaSelector from '@/components/MensaSelector.vue'; // Importing the MensaSelector component

export default {
  components: {
    MensaSelector // Registering the MensaSelector component for use
  },
  data() {
    return {
      selectedRole: localStorage.getItem('selectedRole') || 'Studierende',  // Loading the user role from Local Storage, defaulting to 'Studierende'
      selectedUniversity: localStorage.getItem('selectedUniversity') || '',  // Loading the selected university from Local Storage
      selectedMensa: localStorage.getItem('selectedMensaId') || '',  // Loading the selected Mensa from Local Storage
      universities: [], // An array to hold the list of universities associated with Mensas
      dietPreferences: {
        meat: localStorage.getItem('dietPreferencesMeat') !== null ? JSON.parse(localStorage.getItem('dietPreferencesMeat')) : true,
        vegetarian: localStorage.getItem('dietPreferencesVegetarian') !== null ? JSON.parse(localStorage.getItem('dietPreferencesVegetarian')) : true,
        vegan: localStorage.getItem('dietPreferencesVegan') !== null ? JSON.parse(localStorage.getItem('dietPreferencesVegan')) : true
        // Loading diet preferences from Local Storage, defaulting to true if not set
      },
      balance: parseFloat(localStorage.getItem('selectedBalance')) || 0,  // Loading the balance from Local Storage, defaulting to 0
      transactionAmount: 0, // Amount to add or deduct from the balance
      currentTime: new Date().toLocaleTimeString() // Current time for display
    };
  },
  methods: {
    saveSelection() {
      // Save current selections and preferences in Local Storage
      localStorage.setItem('selectedRole', this.selectedRole);
      localStorage.setItem('selectedUniversity', this.selectedUniversity);
      localStorage.setItem('selectedMensaId', this.selectedMensa);
      localStorage.setItem('selectedBalance', this.balance);

      // Save diet preferences in Local Storage
      localStorage.setItem('dietPreferencesMeat', JSON.stringify(this.dietPreferences.meat));
      localStorage.setItem('dietPreferencesVegetarian', JSON.stringify(this.dietPreferences.vegetarian));
      localStorage.setItem('dietPreferencesVegan', JSON.stringify(this.dietPreferences.vegan));
    },
    setInitialBalance() {
      // Sets the initial balance if the value is positive
      if (this.initialBalance >= 0) {
        this.balance = this.initialBalance;
        this.saveSelection(); // Save the updated balance in Local Storage
      } else {
        alert('Das Guthaben darf nicht negativ sein'); // Alert if negative balance
      }
    },
    addMoney() {
      // Add money to the balance and save the change
      if (this.transactionAmount > 0) {
        this.balance += this.transactionAmount;
        this.saveSelection(); // Save the updated balance in Local Storage
      } else {
        alert('Bitte einen gültigen Betrag eingeben'); // Alert if the input is invalid
      }
    },
    deductMoney() {
      // Deduct money from the balance and save the change
      if (this.transactionAmount > 0 && this.transactionAmount <= this.balance) {
        this.balance -= this.transactionAmount;
        this.saveSelection(); // Save the updated balance in Local Storage
      } else {
        alert('Bitte einen gültigen Betrag eingeben'); // Alert if the input is invalid or exceeds the balance
      }
    },
    extractData() {
      // Extracts and prepares data from the canteen list
      const universitySet = new Set();
      canteens.forEach(canteen => {
        canteen.universities.forEach(uni => universitySet.add(uni)); // Collect all universities linked to Mensas
      });
      this.universities = Array.from(universitySet); // Store unique universities

      this.allMensas = canteens.map(canteen => ({
        name: canteen.name,
        universities: canteen.universities, // Mapping canteen data to a new structure
        id: canteen.id,
        address: canteen.address
      }));

      this.filterCanteensByUniversity(); // Filter the canteens based on the selected university
    },
    filterCanteensByUniversity() {
      // Filter the list of canteens based on the selected university
      if (this.selectedUniversity) {
        this.mensas = this.allMensas.filter(mensa =>
          mensa.universities.includes(this.selectedUniversity)
        );
      } else {
        this.mensas = this.allMensas; // Show all canteens if no university is selected
      }
      this.saveSelection(); // Save changes in the selected university
    },
    saveSettings() {
      // Save user selections and preferences
      this.saveSelection();
      alert('Einstellungen wurden gespeichert!'); // Notify the user that settings have been saved
    }
  },
  computed: {
    shouldShowInitialBalanceInput() {
      // Shows the initial balance input only if the balance is 0
      return this.balance === 0;
    }
  },
  watch: {
    // Automatically save changes when specific data changes
    selectedRole(newValue) {
      this.saveSelection(); // Save the selected role when it changes
    },
    selectedUniversity(newValue) {
      this.saveSelection(); // Save the selected university when it changes
    },
    selectedMensa(newValue) {
      this.saveSelection(); // Save the selected Mensa when it changes

      // Clear local storage items related to meals and badges
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('meals_') || key.startsWith('menue_') || key === 'badges') {
          localStorage.removeItem(key); // Remove meal and badge data from Local Storage
          console.log('removed', key); // Log the removed item for debugging purposes
        }
      });
    },
    dietPreferences: {
      deep: true, // watch on the dietPreferences object
      handler(newValue) {
        this.saveSelection(); // Save diet preferences when they change
      }
    },
    balance(newValue) {
      localStorage.setItem('selectedBalance', newValue); // Save the updated balance when it changes
    }
  },
  mounted() {
    // This code runs when the component is mounted
    this.extractData(); // Extract Mensa data on component mount
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString(); // Update the current time every second
    }, 1000);
    
    // Set default values for diet preferences if not already in Local Storage
    if (localStorage.getItem('dietPreferencesMeat') === null) {
      localStorage.setItem('dietPreferencesMeat', JSON.stringify(true));
    }
    if (localStorage.getItem('dietPreferencesVegetarian') === null) {
      localStorage.setItem('dietPreferencesVegetarian', JSON.stringify(true));
    }
    if (localStorage.getItem('dietPreferencesVegan') === null) {
      localStorage.setItem('dietPreferencesVegan', JSON.stringify(true));
    }
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

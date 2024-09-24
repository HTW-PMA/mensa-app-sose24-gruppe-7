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
            <option>Gast</option>
            <option>Student</option>
            <option>Dozent</option>
          </select>
        </div>

        <!-- University Selection -->
        <div class="mb-3">
          <label for="universitySelect" class="form-label text-start">Universität</label>
          <select class="form-select" id="universitySelect" v-model="selectedUniversity">
            <option>HU</option>
            <option>FU</option>
            <option>TU</option>
          </select>
        </div>

        <!-- Mensa Selection with Pin Button -->
        <div class="mb-3 form-group">
          <label for="mensaSelect" class="form-label text-start">Mensa</label>
          <div class="input-group">
            <select class="form-select" id="mensaSelect" v-model="selectedMensa">
              <option>Mensa HU Oase Adlershof</option>
              <option>Mensa FU Veggie 2.0</option>
              <option>Mensa TU Hardenbergstraße</option>
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
        <button class="btn btn-success mt-3">Speichern</button>
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
        <div v-if="initialBalanceNotSet">
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
export default {
  data() {
    return {
      selectedRole: 'Gast',
      selectedUniversity: 'HU',
      selectedMensa: 'Mensa HU Oase Adlershof',
      dietPreferences: {
        meat: false,
        vegetarian: false,
        vegan: false
      },
      balance: 0,
      initialBalance: 0,
      transactionAmount: 0,
      initialBalanceNotSet: true,
      currentTime: new Date().toLocaleTimeString()
    };
  },
  methods: {
    setInitialBalance() {
      if (this.initialBalance >= 0) {
        this.balance = this.initialBalance;
        this.initialBalanceNotSet = false;
      } else {
        alert('Das Guthaben darf nicht negativ sein');
      }
    },
    addMoney() {
      if (this.transactionAmount > 0) {
        this.balance += this.transactionAmount;
      } else {
        alert('Bitte einen gültigen Betrag eingeben');
      }
    },
    deductMoney() {
      if (this.transactionAmount > 0 && this.transactionAmount <= this.balance) {
        this.balance -= this.transactionAmount;
      } else {
        alert('Bitte einen gültigen Betrag eingeben');
      }
    },
    findNearestCafeteria() {
      // Logic for finding the nearest cafeteria goes here
      alert('Nächste Mensa wird gesucht...');
    }
  },
  mounted() {
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
  border-radius: 12px; /* Rounded corners for a modern look */
}

.card-header {
  font-weight: bold;
}

.btn {
  border-radius: 25px; /* Rounded buttons for a sleek appearance */
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
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* Subtle shadow for modern feel */
}

/* Make labels left-aligned */
.form-label {
  display: block;
  text-align: left;
  font-weight: bold;
}

.ms-2 {
  margin-left: 0.5rem; /* Adjust the space between Mensa select and pin button */
}
</style>

<template>
    <div class="container mt-5">
      <div class="card text-center">
        <div class="card-header">
          Student Credit Balance
        </div>
        <div class="card-body">
          <h5 class="card-title">Kontostand: {{ balance }} €</h5>
  
          <!-- Form for entering the initial balance -->
          <div v-if="initialBalanceNotSet">
            <p class="card-text">Please enter your current student card balance:</p>
            <input v-model.number="initialBalance" type="number" class="form-control" placeholder="Enter balance (e.g. 200)">
            <button @click="setInitialBalance" class="btn btn-primary mt-3">Submit</button>
          </div>
  
          <!-- Controls for adjusting the balance -->
          <div v-else>
            <p class="card-text">Add or deduct money from your balance:</p>
            <input v-model.number="transactionAmount" type="number" class="form-control" placeholder="Enter amount (e.g. 10)">
            <div class="btn-group mt-3">
              <button @click="addMoney" class="btn btn-success">Add</button>
              <button @click="deductMoney" class="btn btn-danger">Deduct</button>
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
          alert('Balance cannot be negative');
        }
      },
      addMoney() {
        if (this.transactionAmount > 0) {
          this.balance += this.transactionAmount;
        } else {
          alert('Enter a valid amount to add');
        }
      },
      deductMoney() {
        if (this.transactionAmount > 0 && this.transactionAmount <= this.balance) {
          this.balance -= this.transactionAmount;
        } else {
          alert('Enter a valid amount to deduct');
        }
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
    max-width: 400px;
  }
  .card {
    margin-top: 20px;
  }
  </style>
  
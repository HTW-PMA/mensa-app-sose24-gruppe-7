<template>
  <section id="services" class="services">
    <h2>Our Services</h2>
    <div class="service-cards">
      <div class="card" v-for="service in services" :key="service.id">
        <h3>{{ service.title }}</h3>
        <p>{{ service.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const services = ref([
  { id: 1, title: 'Service One', description: 'Description of service one.' },
  { id: 2, title: 'Service Two', description: 'Description of service two.' },
  { id: 3, title: 'Service Three', description: 'Description of service three.' },
]);
</script>

<style scoped>
.services {
  text-align: center;
  padding: 2rem;
  background-color: #fff;
}

.service-cards {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
}

.card {
  background-color: #eee;
  padding: 1rem;
  border-radius: 5px;
  width: 30%;
}

.card h3 {
  font-size: 1.75rem;
}

.card p {
  font-size: 1rem;
}
</style>
  
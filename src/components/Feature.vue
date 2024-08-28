<template>
    <section id="services" class="services">
      <h2>Our Services</h2>
      <div class="service-cards">
        <div class="card">
          <h3>Service One</h3>
          <p>Description of service one.</p>
        </div>
        <div class="card">
          <h3>Service Two</h3>
          <p>Description of service two.</p>
        </div>
        <div class="card">
          <h3>Service Three</h3>
          <p>Description of service three.</p>
        </div>
      </div>
    </section>
  </template>
  
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
  
<template>
    <div class="d-flex flex-column justify-content-center align-items-center vh-100">
      <!-- Sign up form container -->
      <div class="card signup-card shadow-sm rounded">
        <div class="card-body p-5">
          <h3 class="text-center mb-4">Sign Up</h3>
          <p class="text-center text-muted">Let's get started!👋</p>
          <form>
            <div class="mb-4">
              <input type="text" class="form-control form-control-lg" id="firstname" placeholder="First name" />
            </div>
            <div class="mb-4">
              <input type="text" class="form-control form-control-lg" id="lastname" placeholder="Last name" />
            </div>
            <div class="mb-4">
              <input type="date" class="form-control form-control-lg" id="birthdate" placeholder="Date of Birth" />
            </div>
            <div class="mb-4">
              <input type="email" class="form-control form-control-lg" id="email" placeholder="Enter your email" />
            </div>
            <div class="mb-4">
              <input type="text" class="form-control form-control-lg" id="studentID" placeholder="Student ID" />
            </div>
            <div class="mb-4">
              <input type="password" class="form-control form-control-lg" id="password" placeholder="Enter password" />
            </div>
            <div class="mb-4">
              <input type="password" class="form-control form-control-lg" id="confirm_password" placeholder="Confirm password" />
            </div>
            <div class="d-flex justify-content-between align-items-center mb-4">
            </div>
            <button type="submit" class="btn btn-primary w-100 btn-lg">Sign Up</button>
          </form>
          <p class="text-center mt-4">Already have an account?<a href="#" class="text-primary">Login</a></p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // You can add the login logic here later
  </script>
  
  <style scoped>
  body {
    background-color: #f8f9fa;
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
  }
  
  .vh-100 {
    height: 100vh;
  }
  
  .signup-card {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px; /* Fixed maximum width */
    width: 100%; /* Full width in smaller viewports */
  }
  
  h3 {
    font-weight: 600;
    color: #333;
  }
  
  .form-control {
    border-radius: 8px;
    border: 1px solid #ced4da;
    padding: 12px;
  }
  
  .form-control:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  .btn-primary {
    background-color: #007bff;
    border: none;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    font-size: 1.2rem;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  footer {
    width: 100%;
    background-color: #343a40;
    position: relative;
    bottom: 0;
  }
  
  footer p {
    margin: 0;
    color: #fff;
  }
  
  @media (max-width: 576px) {
    .login-card {
      margin: 10px;
      max-width: 90%;
    }
  }
  </style>
  
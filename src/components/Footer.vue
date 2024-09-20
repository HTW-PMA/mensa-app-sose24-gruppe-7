<template>
  <footer class="footer">
    <p>&copy; 2024 Your Company. All rights reserved.</p>
  </footer>
</template>

<style scoped>
/* Footer Section */
.footer {
  width: 100%; /* Full width of the parent container */
  background-color: #333;
  color: white;
  padding: 40px 20px;
  text-align: center;
  overflow: hidden; /* Prevents horizontal scrolling */
  position: relative;
  min-height: 100px; /* Minimum height for the footer */
  flex-shrink: 0; /* Prevents shrinking */
}

/* Optional: If the footer should take full height */
.footer.full-height {
  height: 100vh; /* Takes up full viewport height */
}
</style>
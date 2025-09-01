<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Main app component
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden;
}

#app {
  height: 100vh;
  min-height: 100vh;
}

/* Global responsive utilities */
.text-h5-xs {
  font-size: 1.125rem !important;
  line-height: 1.5 !important;
}

.text-h6-sm {
  font-size: 1.25rem !important;
  line-height: 1.4 !important;
}

.text-body-1-xs {
  font-size: 1rem !important;
  line-height: 1.5 !important;
}

/* Responsive breakpoint utilities */
@media (max-width: 600px) {
  .text-h3 {
    font-size: 1.75rem !important;
  }
  
  .text-h4 {
    font-size: 1.5rem !important;
  }
  
  .text-h5 {
    font-size: 1.25rem !important;
  }
}

@media (max-width: 400px) {
  .text-h3 {
    font-size: 1.5rem !important;
  }
  
  .text-h4 {
    font-size: 1.25rem !important;
  }
  
  .text-h5 {
    font-size: 1.125rem !important;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Better touch targets on mobile */
@media (max-width: 600px) {
  .v-btn {
    min-height: 44px;
  }
  
  .v-list-item {
    min-height: 48px;
  }
}

/* Prevent zoom on input focus on iOS */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  input, select, textarea {
    font-size: 16px;
  }
}
</style>

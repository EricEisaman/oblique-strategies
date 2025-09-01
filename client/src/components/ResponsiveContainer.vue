<template>
  <div class="responsive-container">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

const display = useDisplay();

const isMobile = computed(() => display.smAndDown.value);
const isTablet = computed(() => display.md.value);
const isDesktop = computed(() => display.lgAndUp.value);

// Expose responsive states to parent components
defineExpose({
  isMobile,
  isTablet,
  isDesktop,
});
</script>

<style scoped>
.responsive-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  transition: all 0.3s ease;
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .responsive-container {
    padding: 0 8px;
  }
}

@media (max-width: 400px) {
  .responsive-container {
    padding: 0 4px;
  }
}

/* Tablet optimizations */
@media (min-width: 601px) and (max-width: 960px) {
  .responsive-container {
    padding: 0 16px;
  }
}

/* Desktop optimizations */
@media (min-width: 961px) {
  .responsive-container {
    padding: 0 24px;
  }
}
</style>

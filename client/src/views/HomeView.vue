<template>
  <v-app>
    <v-main class="app-background">
      <v-container fluid class="fill-height pa-0">
        <v-row no-gutters justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="pa-4">
            <!-- Main Strategy Card -->
            <v-card 
              class="strategy-card mx-auto" 
              elevation="12" 
              rounded="xl"
              :class="{ 'mobile-card': $vuetify.display.smAndDown }"
            >
              <v-card-title class="text-center pa-6">
                <div class="d-flex flex-column align-center">
                  <span class="text-h3 text-h4-sm text-h5-xs font-weight-light mb-2">
                    Oblique Strategies
                  </span>
                  <v-divider class="my-2" style="width: 60%"></v-divider>
                </div>
              </v-card-title>
              
              <v-card-text class="text-center pa-6">
                <div class="strategy-text-container">
                  <p class="text-h5 text-h6-sm text-body-1-xs font-weight-regular">
                    {{ store.currentStrategy }}
                  </p>
                </div>
              </v-card-text>
              
              <v-card-actions class="justify-center pa-6 pt-0">
                <v-btn
                  color="primary"
                  size="x-large"
                  @click="store.getRandomStrategy"
                  :loading="store.loading"
                  :block="$vuetify.display.smAndDown"
                  class="strategy-btn"
                >
                  <v-icon left class="mr-2">mdi-refresh</v-icon>
                  <span class="d-none d-sm-block">New Strategy</span>
                  <span class="d-block d-sm-none">New</span>
                </v-btn>
              </v-card-actions>
              
              <v-card-actions class="justify-center pa-6 pt-0">
                <v-btn
                  variant="outlined"
                  @click="store.toggleFavorites"
                  :color="store.showFavorites ? 'primary' : 'default'"
                  :block="$vuetify.display.smAndDown"
                  class="favorites-btn"
                >
                  <v-icon left class="mr-2">mdi-star</v-icon>
                  <span class="d-none d-sm-block">
                    {{ store.showFavorites ? 'All Strategies' : 'Favorites' }}
                  </span>
                  <span class="d-block d-sm-none">
                    {{ store.showFavorites ? 'All' : 'Favs' }}
                  </span>
                </v-btn>
              </v-card-actions>
            </v-card>
            
            <!-- Favorites Section -->
            <v-expand-transition>
              <v-card 
                v-if="store.showFavorites && store.hasFavorites" 
                class="mt-4 mx-auto favorites-card" 
                elevation="8"
                rounded="lg"
              >
                <v-card-title class="text-h6 pa-4">
                  <v-icon left class="mr-2">mdi-star</v-icon>
                  Your Favorites
                  <v-chip 
                    color="primary" 
                    size="small" 
                    class="ml-2"
                  >
                    {{ store.favoritesCount }}
                  </v-chip>
                </v-card-title>
                
                <v-card-text class="pa-4 pt-0">
                  <v-list class="favorites-list">
                    <v-list-item
                      v-for="(strategy, index) in store.favorites"
                      :key="index"
                      class="mb-2 favorites-item"
                      rounded="md"
                    >
                      <v-list-item-title class="text-body-1">
                        {{ strategy }}
                      </v-list-item-title>
                      
                      <template v-slot:append>
                        <v-btn
                          icon="mdi-delete"
                          variant="text"
                          size="small"
                          color="error"
                          @click="store.removeFavorite(strategy)"
                          class="delete-btn"
                        />
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-expand-transition>
            
            <!-- Empty Favorites State -->
            <v-expand-transition>
              <v-card 
                v-if="store.showFavorites && !store.hasFavorites" 
                class="mt-4 mx-auto" 
                elevation="4"
                rounded="lg"
              >
                <v-card-text class="text-center pa-6">
                  <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-star-outline</v-icon>
                  <p class="text-body-1 text-grey-lighten-1">No favorites yet</p>
                  <p class="text-caption text-grey-lighten-2">Click the star button on strategies you like</p>
                </v-card-text>
              </v-card>
            </v-expand-transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useObliqueStore } from '@/stores/oblique';

const store = useObliqueStore();

onMounted(() => {
  store.initializeApp();
});
</script>

<style scoped>
.app-background {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.strategy-card {
  max-width: 600px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-card {
  max-width: 100%;
  margin: 0 8px;
}

.strategy-text-container {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.strategy-btn {
  min-width: 200px;
  height: 56px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.favorites-btn {
  min-width: 180px;
  height: 48px;
  font-weight: 500;
}

.favorites-card {
  max-width: 600px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.favorites-list {
  background: transparent;
}

.favorites-item {
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.favorites-item:hover {
  background: rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.delete-btn {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.delete-btn:hover {
  opacity: 1;
}

/* Responsive text sizing */
@media (max-width: 600px) {
  .strategy-text-container {
    min-height: 100px;
    padding: 16px 0;
  }
  
  .strategy-card {
    margin: 0 4px;
  }
}

@media (max-width: 400px) {
  .strategy-text-container {
    min-height: 80px;
    padding: 12px 0;
  }
}

/* Dark theme adjustments */
.v-theme--dark .strategy-card,
.v-theme--dark .favorites-card {
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .favorites-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .favorites-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* Smooth transitions */
.v-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states for accessibility */
.v-btn:focus-visible {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* Loading animation */
.v-btn--loading {
  position: relative;
}

.v-btn--loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height pa-0">
        <v-row no-gutters justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="pa-4">
            <!-- Divine Logo - Always at top center -->
            <div class="text-center mb-6">
              <div class="d-flex flex-column align-center">
                <v-img
                  src="/icon-256x256.png"
                  alt="Divine Logo"
                  :width="$vuetify.display.smAndDown ? 48 : 64"
                  :height="$vuetify.display.smAndDown ? 48 : 64"
                  class="mb-3"
                  contain
                />
                <span class="text-h3 text-h4-sm text-h5-xs font-weight-light">
                  Divine
                </span>
                <v-container class="pa-0">
                  <v-row justify="center">
                    <v-col cols="8" sm="6" md="4">
                      <v-divider class="my-2"></v-divider>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </div>

            <!-- Offline Status Indicator -->
            <v-alert
              v-if="store.isOffline"
              type="info"
              variant="tonal"
              class="mb-4"
              density="compact"
            >
              <template v-slot:prepend>
                <v-icon>mdi-wifi-off</v-icon>
              </template>
              <span class="text-caption">Working offline - Using local strategies</span>
            </v-alert>

            <!-- Main Strategy Card -->
            <v-card
              class="mx-auto"
              elevation="12"
              rounded="xl"
            >
              <v-card-text class="text-center pa-6">
                <div class="d-flex align-center justify-center">
                  <p class="text-h5 text-h6-sm text-body-1-xs font-weight-regular">
                    {{ store.currentStrategy }}
                  </p>
                </div>
              </v-card-text>

              <!-- Star Button for Adding to Favorites -->
              <v-card-actions class="justify-center pa-4 pt-0">
                <v-btn
                  :icon="store.isCurrentFavorite ? 'mdi-star' : 'mdi-star-outline'"
                  :color="store.isCurrentFavorite ? 'amber' : 'grey'"
                  size="large"
                  variant="text"
                  @click="store.addToFavorites"
                  :disabled="!store.currentStrategy || store.currentStrategy.includes('Click')"
                />
              </v-card-actions>

              <v-card-actions class="justify-center pa-6 pt-0">
                <v-btn
                  color="primary"
                  size="x-large"
                  @click="store.getRandomStrategy"
                  :loading="store.loading"
                  :block="$vuetify.display.smAndDown"
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
                class="mt-4 mx-auto"
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
                  <v-list>
                    <v-list-item
                      v-for="(strategy, index) in store.favorites"
                      :key="index"
                      class="mb-2"
                      rounded="md"
                    >
                      <v-list-item-title class="text-body-1">
                        {{ strategy }}
                      </v-list-item-title>

                      <template v-slot:append>
                        <v-btn
                          icon="mdi-close"
                          variant="text"
                          size="small"
                          color="error"
                          @click="store.removeFavorite(strategy)"
                        />
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>

                <v-card-actions class="justify-center pa-4 pt-0">
                  <v-btn
                    variant="outlined"
                    color="error"
                    @click="store.clearFavorites"
                    size="small"
                  >
                    <v-icon left class="mr-2">mdi-delete-sweep</v-icon>
                    Clear All
                  </v-btn>
                </v-card-actions>
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
import { clientLogger, withErrorHandling } from '@/utils/logger';

const store = useObliqueStore();

onMounted(async () => {
  const result = await withErrorHandling(
    store.initializeApp,
    'Failed to initialize app',
    clientLogger,
  );

  if (!result.success) {
    clientLogger.error('Failed to initialize app', result.error);
  }
});
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height pa-0">
        <v-row no-gutters justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="pa-4">
            <!-- Main Strategy Card -->
            <v-card
              class="mx-auto"
              elevation="12"
              rounded="xl"
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
                <div class="d-flex align-center justify-center">
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
                          icon="mdi-delete"
                          variant="text"
                          size="small"
                          color="error"
                          @click="store.removeFavorite(strategy)"
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
  void store.initializeApp();
});
</script>

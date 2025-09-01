<template>
  <v-app>
    <!-- PWA Update Snackbar -->
    <v-snackbar
      v-model="updateAvailable"
      color="primary"
      timeout="-1"
      location="top"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-update</v-icon>
        <span>New version available</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="handleUpdate"
        >
          Update
        </v-btn>
        <v-btn
          variant="text"
          @click="updateAvailable = false"
        >
          Later
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Offline Indicator -->
    <v-snackbar
      v-model="offline"
      color="warning"
      timeout="-1"
      location="bottom"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-wifi-off</v-icon>
        <span>You're offline - App works locally</span>
      </div>
    </v-snackbar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { clientLogger } from '@/utils/logger';

const updateAvailable = ref(false);
const offline = ref(false);

const handleUpdate = async (): Promise<void> => {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  } catch (error) {
    clientLogger.error('Error applying PWA update', error);
  }
};
</script>

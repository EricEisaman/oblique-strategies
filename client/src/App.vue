<template>
  <v-app>
    <!-- PWA Handler Component -->
    <PWAHandler ref="pwaHandler" />

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

    <!-- PWA Install Button -->
    <v-snackbar
      v-model="showInstallButton"
      color="success"
      timeout="-1"
      location="bottom"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-download</v-icon>
        <span>Install Divine for quick access</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="handleInstall"
        >
          Install
        </v-btn>
        <v-btn
          variant="text"
          @click="showInstallButton = false"
        >
          Later
        </v-btn>
      </template>
    </v-snackbar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PWAHandler from '@/components/PWAHandler.vue';

const pwaHandler = ref<InstanceType<typeof PWAHandler> | null>(null);

const updateAvailable = computed({
  get: () => pwaHandler.value?.updateAvailable ?? false,
  set: (value: boolean) => {
    if (pwaHandler.value) {
      pwaHandler.value.updateAvailable = value;
    }
  },
});

const offline = computed({
  get: () => pwaHandler.value?.offline ?? false,
  set: (value: boolean) => {
    if (pwaHandler.value) {
      pwaHandler.value.offline = value;
    }
  },
});

const showInstallButton = computed({
  get: () => pwaHandler.value?.showInstallButton ?? false,
  set: (value: boolean) => {
    if (pwaHandler.value) {
      pwaHandler.value.showInstallButton = value;
    }
  },
});

const handleUpdate = (): void => {
  pwaHandler.value?.handleUpdate();
};

const handleInstall = (): void => {
  pwaHandler.value?.handleInstall();
};
</script>

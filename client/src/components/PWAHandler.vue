import { defineComponent, onMounted, ref } from 'vue';
import { clientLogger, withErrorHandling } from '@/utils/logger';

export default defineComponent({
  name: 'PWAHandler',
  setup() {
    const updateAvailable = ref(false);
    const offline = ref(false);
    const installPrompt = ref<BeforeInstallPromptEvent | null>(null);
    const showInstallButton = ref(false);

    const checkOnlineStatus = (): void => {
      offline.value = !navigator.onLine;
      clientLogger.info('Online status changed', { online: !offline.value });
    };

    const handleInstall = async (): Promise<void> => {
      const result = await withErrorHandling(
        async () => {
          if (installPrompt.value) {
            await installPrompt.value.prompt();
            const { outcome } = await installPrompt.value.userChoice;
            
            if (outcome === 'accepted') {
              clientLogger.info('PWA installation accepted by user');
            } else {
              clientLogger.info('PWA installation declined by user');
            }
            
            installPrompt.value = null;
            showInstallButton.value = false;
          }
        },
        'Error during PWA installation',
        clientLogger
      );
      
      if (!result.success) {
        clientLogger.error('Error during PWA installation', result.error);
      }
    };

    const handleUpdate = async (): Promise<void> => {
      const result = await withErrorHandling(
        async () => {
          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration && registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
              clientLogger.info('PWA update applied successfully');
            }
          }
        },
        'Error applying PWA update',
        clientLogger
      );
      
      if (!result.success) {
        clientLogger.error('Error applying PWA update', result.error);
      }
    };

    const registerServiceWorker = async (): Promise<void> => {
      const result = await withErrorHandling(
        async () => {
          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.register('/sw.js');
            clientLogger.info('Service Worker registered successfully', { scope: registration.scope });

            // Handle updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    updateAvailable.value = true;
                    clientLogger.info('PWA update available');
                  }
                });
              }
            });

            // Handle controller change
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              clientLogger.info('Service Worker controller changed');
            });
          }
        },
        'Service Worker registration failed',
        clientLogger
      );
      
      if (!result.success) {
        clientLogger.error('Service Worker registration failed', result.error);
      }
    };

    onMounted(() => {
      registerServiceWorker();

      // Listen for online/offline events
      window.addEventListener('online', checkOnlineStatus);
      window.addEventListener('offline', checkOnlineStatus);
      checkOnlineStatus();

      // Listen for beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        installPrompt.value = event;
        showInstallButton.value = true;
        clientLogger.info('PWA install prompt available');
      });

      // Listen for appinstalled event
      window.addEventListener('appinstalled', () => {
        showInstallButton.value = false;
        installPrompt.value = null;
        clientLogger.info('PWA installed successfully');
      });

      // Listen for service worker messages
      navigator.serviceWorker?.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          clientLogger.info('Cache updated', event.data.payload);
        }
      });
    });

    return {
      updateAvailable,
      offline,
      handleUpdate,
    };
  },
});

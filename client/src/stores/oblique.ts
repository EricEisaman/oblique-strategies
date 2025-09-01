import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { clientLogger } from '@/utils/logger';

interface StrategyResponse {
  strategy: string;
}

export const useObliqueStore = defineStore('oblique', () => {
  const currentStrategy = ref<string>('Click "New Strategy" to begin');
  const loading = ref<boolean>(false);
  const showFavorites = ref<boolean>(false);
  const favorites = ref<string[]>([]);
  const isMobile = ref<boolean>(false);

  // Computed properties
  const favoritesCount = computed(() => favorites.value.length);
  const hasFavorites = computed(() => favorites.value.length > 0);

  // Actions
  const getRandomStrategy = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await axios.get<StrategyResponse>('/api/strategies/random');
      currentStrategy.value = response.data.strategy;
      clientLogger.info('Successfully fetched random strategy');
    } catch (error) {
      clientLogger.error('Error fetching strategy', error);
      currentStrategy.value = 'Error loading strategy';
    } finally {
      loading.value = false;
    }
  };

  const toggleFavorites = (): void => {
    showFavorites.value = !showFavorites.value;
  };

  const addToFavorites = (): void => {
    if (currentStrategy.value && !favorites.value.includes(currentStrategy.value)) {
      favorites.value.push(currentStrategy.value);
      saveFavorites();
      clientLogger.info('Added strategy to favorites', currentStrategy.value);
    }
  };

  const removeFavorite = (strategy: string): void => {
    favorites.value = favorites.value.filter(fav => fav !== strategy);
    saveFavorites();
    clientLogger.info('Removed strategy from favorites', strategy);
  };

  const clearFavorites = (): void => {
    favorites.value = [];
    saveFavorites();
    clientLogger.info('Cleared all favorites');
  };

  const saveFavorites = (): void => {
    localStorage.setItem('oblique-favorites', JSON.stringify(favorites.value));
  };

  const loadFavorites = (): void => {
    const saved = localStorage.getItem('oblique-favorites');
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
          favorites.value = parsed;
          clientLogger.info('Successfully loaded favorites from localStorage', { count: parsed.length });
        } else {
          clientLogger.warn('Invalid favorites format in localStorage, resetting to empty array');
          favorites.value = [];
        }
      } catch (error) {
        clientLogger.error('Error loading favorites from localStorage', error);
        favorites.value = [];
      }
    }
  };

  const setMobileState = (mobile: boolean): void => {
    isMobile.value = mobile;
  };

  const initializeApp = async (): Promise<void> => {
    clientLogger.info('Initializing Oblique Strategies application');
    loadFavorites();
    await getRandomStrategy();

    // Set initial mobile state
    setMobileState(window.innerWidth < 600);

    // Listen for resize events
    window.addEventListener('resize', () => {
      setMobileState(window.innerWidth < 600);
    });

    clientLogger.info('Application initialization complete');
  };

  return {
    // State
    currentStrategy,
    loading,
    showFavorites,
    favorites,
    isMobile,

    // Computed
    favoritesCount,
    hasFavorites,

    // Actions
    getRandomStrategy,
    toggleFavorites,
    addToFavorites,
    removeFavorite,
    clearFavorites,
    saveFavorites,
    loadFavorites,
    setMobileState,
    initializeApp,
  };
});

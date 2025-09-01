import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { clientLogger, withErrorHandling, type Result } from '@/utils/logger';
import { indexedDBService } from '@/utils/indexedDB';

interface StrategyResponse {
  strategy: string;
}

// Local strategies cache for offline functionality
const LOCAL_STRATEGIES = [
  'A line has two sides',
  'Abandon desire',
  'Abandon normal instructions',
  'Accept advice',
  'Adding on',
  'Always the first steps',
  'Ask people to work against their better judgement',
  'Ask your body',
  'Be dirty',
  'Be extravagant',
  'Be less critical',
  'Breathe more deeply',
  'Bridges -build -burn',
  'Change ambiguities to specifics',
  'Change nothing and continue consistently',
  'Change specifics to ambiguities',
  'Consider transitions',
  'Courage!',
  'Cut a vital connection',
  'Decorate',
  'Destroy nothing; Destroy the most important thing',
  'Discard an axiom',
  'Disciplined self-indulgence',
  'Discover your formulas and abandon them',
  'Display your talent',
  'Distort time',
  'Do nothing for as long as possible',
  'Do something boring',
  'Do something sudden',
  'Do the last thing first',
  'Do the words need changing?',
  "Don't avoid what is easy",
  "Don't break the silence",
  "Don't stress one thing more than another",
  'Emphasize differences',
  'Emphasize the flaws',
  'Faced with a choice',
  'Find a safe part and use it as an anchor',
  'Give the game away',
  'Give way to your worst impulse',
  'Go outside. Shut the door.',
  'Go to an extreme',
  'How would someone else do it?',
  'How would you have done it?',
  'In total darkness',
  'Is it finished?',
  'Is something missing?',
  'Is the style right?',
  'It is simply a matter of work',
  'Just carry on',
  'Listen to the quiet voice',
  'Look at the order in which you do things',
  'Magnify the most difficult details',
  'Make it more sensual',
  "Make what's perfect more human",
  'Move towards the unimportant',
  'Not building a wall; making a brick',
  'Once the search has begun',
  'Only a part',
  'Only one element of each kind',
  'Openly resist change',
  "Pae White's non-blank graphic metacard",
  'Question the heroic',
  'Remember quiet evenings',
  'Remove a restriction',
  'Repetition is a form of change',
  'Retrace your steps',
  'Reverse',
  'Simple Subtraction',
  'Slow preparation',
  'State the problem as clearly as possible',
  'Take a break',
  'Take away the important parts',
  'The inconsistency principle',
  'The most easily forgotten thing is the most important',
  'Think - inside the work -outside the work',
  'Tidy up',
  'Try faking it',
  'Turn it upside down',
  "Use 'unqualified' people",
  'Use an old idea',
  'Use cliches',
  'Use filters',
  'Use something nearby as a model',
  'Use your own ideas',
  'Voice your suspicions',
  'Water',
  'What context would look right?',
  'What is the simplest solution?',
  'What mistakes did you make last time?',
  'What to increase? What to reduce? What to maintain?',
  'What were you really thinking about just now?',
  'What would your closest friend do?',
  "What wouldn't you do?",
  'When is it for?',
  'Where is the edge?',
  'Which parts can be grouped?',
  'Work at a different speed',
  'Would anyone want it?',
  'Your mistake was a hidden intention',
];

export const useObliqueStore = defineStore('oblique', () => {
  const currentStrategy = ref<string>('Click "New Strategy" to begin');
  const loading = ref<boolean>(false);
  const showFavorites = ref<boolean>(false);
  const favorites = ref<string[]>([]);
  const isMobile = ref<boolean>(false);
  const isOffline = ref<boolean>(false);
  const isCurrentFavorite = ref<boolean>(false);

  // Computed properties
  const favoritesCount = computed(() => favorites.value.length);
  const hasFavorites = computed(() => favorites.value.length > 0);

  // Get random strategy from local cache
  const getLocalStrategy = (): string => {
    const randomIndex = Math.floor(Math.random() * LOCAL_STRATEGIES.length);
    return LOCAL_STRATEGIES[randomIndex] ?? 'Be less critical';
  };

  // Actions
  const getRandomStrategy = async (): Promise<void> => {
    loading.value = true;
    
    const result = await withErrorHandling(
      async () => {
        const response = await axios.get<StrategyResponse>('/api/strategies/random');
        return response.data.strategy;
      },
      'Failed to fetch random strategy from API',
      clientLogger
    );

    if (result.success) {
      currentStrategy.value = result.data;
      clientLogger.info('Successfully fetched random strategy from API');
    } else {
      // Fallback to local strategies if API fails
      clientLogger.warn('API unavailable, using local strategies', result.error);
      currentStrategy.value = getLocalStrategy();
      isOffline.value = true;
    }
    
    // Check if current strategy is in favorites
    await checkCurrentFavorite();
    loading.value = false;
  };

  const toggleFavorites = (): void => {
    showFavorites.value = !showFavorites.value;
  };

  const addToFavorites = async (): Promise<void> => {
    if (!currentStrategy.value) return;
    
    const result = await withErrorHandling(
      async () => {
        await indexedDBService.addFavorite(currentStrategy.value);
        return true;
      },
      'Failed to add strategy to favorites',
      clientLogger
    );

    if (result.success) {
      await loadFavorites(); // Refresh favorites list
      isCurrentFavorite.value = true;
      clientLogger.info('Added strategy to favorites', currentStrategy.value);
    }
  };

  const removeFavorite = async (strategy: string): Promise<void> => {
    const result = await withErrorHandling(
      async () => {
        await indexedDBService.removeFavorite(strategy);
        return true;
      },
      'Failed to remove strategy from favorites',
      clientLogger
    );

    if (result.success) {
      await loadFavorites(); // Refresh favorites list
      if (strategy === currentStrategy.value) {
        isCurrentFavorite.value = false;
      }
      clientLogger.info('Removed strategy from favorites', strategy);
    }
  };

  const clearFavorites = async (): Promise<void> => {
    const result = await withErrorHandling(
      async () => {
        await indexedDBService.clearFavorites();
        return true;
      },
      'Failed to clear favorites',
      clientLogger
    );

    if (result.success) {
      favorites.value = [];
      isCurrentFavorite.value = false;
      clientLogger.info('Cleared all favorites');
    }
  };

  const checkCurrentFavorite = async (): Promise<void> => {
    if (!currentStrategy.value) {
      isCurrentFavorite.value = false;
      return;
    }

    const result = await withErrorHandling(
      async () => {
        return await indexedDBService.isFavorite(currentStrategy.value);
      },
      'Failed to check if strategy is favorite',
      clientLogger
    );

    if (result.success) {
      isCurrentFavorite.value = result.data;
    } else {
      isCurrentFavorite.value = false;
    }
  };

  const loadFavorites = async (): Promise<void> => {
    const result = await withErrorHandling(
      async () => {
        return await indexedDBService.getFavorites();
      },
      'Failed to load favorites from IndexedDB',
      clientLogger
    );

    if (result.success) {
      favorites.value = result.data;
      clientLogger.info('Successfully loaded favorites from IndexedDB', { count: result.data.length });
    } else {
      favorites.value = [];
      clientLogger.error('Error loading favorites from IndexedDB', result.error);
    }
  };

  const setMobileState = (mobile: boolean): void => {
    isMobile.value = mobile;
  };

  const checkOnlineStatus = (): void => {
    isOffline.value = !navigator.onLine;
    clientLogger.info('Online status checked', { online: !isOffline.value });
  };

  const initializeApp = async (): Promise<void> => {
    clientLogger.info('Initializing Oblique Strategies application');
    loadFavorites();
    checkOnlineStatus();
    await getRandomStrategy();

    // Set initial mobile state
    setMobileState(window.innerWidth < 600);

    // Listen for resize events
    window.addEventListener('resize', () => {
      setMobileState(window.innerWidth < 600);
    });

    // Listen for online/offline events
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    clientLogger.info('Application initialization complete');
  };

  return {
    // State
    currentStrategy,
    loading,
    showFavorites,
    favorites,
    isMobile,
    isOffline,
    isCurrentFavorite,

    // Computed
    favoritesCount,
    hasFavorites,

    // Actions
    getRandomStrategy,
    toggleFavorites,
    addToFavorites,
    removeFavorite,
    clearFavorites,
    loadFavorites,
    checkCurrentFavorite,
    setMobileState,
    checkOnlineStatus,
    initializeApp,
  };
});

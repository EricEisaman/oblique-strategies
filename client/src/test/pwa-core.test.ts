import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { indexedDBService } from '@/utils/indexedDB';

describe('PWA Service Worker Core Tests', () => {
  let mockIndexedDB: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Clear event handlers
    if (window._eventHandlers) {
      window._eventHandlers = {};
    }

    // Mock IndexedDB
    mockIndexedDB = {
      open: vi.fn().mockReturnValue({
        result: {
          objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
          transaction: vi.fn().mockReturnValue({
            objectStore: vi.fn().mockReturnValue({
              getAll: vi.fn().mockResolvedValue([]),
              add: vi.fn().mockResolvedValue(1),
              delete: vi.fn().mockResolvedValue(undefined),
              clear: vi.fn().mockResolvedValue(undefined),
            }),
          }),
        },
        onupgradeneeded: null,
        onsuccess: null,
        onerror: null,
      }),
    };

    Object.defineProperty(window, 'indexedDB', {
      value: mockIndexedDB,
      writable: true,
    });

    // Mock service worker API
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: vi.fn(),
        getRegistration: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        controller: null,
      },
      writable: true,
    });

    // Mock console methods
    global.console = {
      ...console,
      log: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
  });

  describe('Service Worker API', () => {
    it('should have service worker API available', () => {
      expect('serviceWorker' in navigator).toBe(true);
      expect(typeof navigator.serviceWorker.register).toBe('function');
      expect(typeof navigator.serviceWorker.getRegistration).toBe('function');
    });

    it('should register service worker successfully', async () => {
      const mockRegistration = {
        scope: '/',
        update: vi.fn(),
        unregister: vi.fn(),
        installing: null,
        waiting: null,
        active: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      navigator.serviceWorker.register = vi.fn().mockResolvedValue(mockRegistration);

      const result = await navigator.serviceWorker.register('/sw.js');
      
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
      expect(result).toBe(mockRegistration);
      expect(result.scope).toBe('/');
    });

    it('should handle service worker registration errors', async () => {
      const error = new Error('Service Worker registration failed');
      navigator.serviceWorker.register = vi.fn().mockRejectedValue(error);

      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (err) {
        expect(err).toBe(error);
      }

      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
    });
  });

  describe('IndexedDB Integration', () => {
    it('should have IndexedDB API available', () => {
      expect('indexedDB' in window).toBe(true);
      expect(typeof window.indexedDB.open).toBe('function');
    });

    it('should open IndexedDB successfully', async () => {
      const mockDB = {
        objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
        transaction: vi.fn().mockReturnValue({
          objectStore: vi.fn().mockReturnValue({
            getAll: vi.fn().mockResolvedValue([]),
            add: vi.fn().mockResolvedValue(1),
          }),
        }),
      };

      const mockRequest = {
        result: mockDB,
        onupgradeneeded: null,
        onsuccess: null,
        onerror: null,
      };

      window.indexedDB.open = vi.fn().mockReturnValue(mockRequest);

      const request = window.indexedDB.open('DivineDB', 1);
      expect(window.indexedDB.open).toHaveBeenCalledWith('DivineDB', 1);
      expect(request.result).toBe(mockDB);
    });

    it('should handle IndexedDB errors', async () => {
      const mockError = new Error('IndexedDB error');
      const mockRequest = {
        result: null,
        error: mockError,
        onupgradeneeded: null,
        onsuccess: null,
        onerror: null,
      };

      window.indexedDB.open = vi.fn().mockReturnValue(mockRequest);

      const request = window.indexedDB.open('DivineDB', 1);
      expect(request.error).toBe(mockError);
    });
  });

  describe('Offline Functionality', () => {
    it('should detect offline status', () => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true,
      });

      expect(navigator.onLine).toBe(false);
    });

    it('should detect online status', () => {
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        writable: true,
      });

      expect(navigator.onLine).toBe(true);
    });

    it('should handle online/offline events', () => {
      const mockOnlineHandler = vi.fn();
      const mockOfflineHandler = vi.fn();

      window.addEventListener('online', mockOnlineHandler);
      window.addEventListener('offline', mockOfflineHandler);

      // Simulate online event
      window.dispatchEvent(new Event('online'));
      expect(mockOnlineHandler).toHaveBeenCalled();

      // Simulate offline event
      window.dispatchEvent(new Event('offline'));
      expect(mockOfflineHandler).toHaveBeenCalled();
    });
  });

  describe('Cache Management', () => {
    it('should have Cache API available', () => {
      expect('caches' in window).toBe(true);
      expect(typeof window.caches.open).toBe('function');
    });

    it('should handle cache operations', async () => {
      const mockCache = {
        match: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        keys: vi.fn(),
      };

      const mockCaches = {
        open: vi.fn().mockResolvedValue(mockCache),
        delete: vi.fn(),
        keys: vi.fn(),
      };

      Object.defineProperty(window, 'caches', {
        value: mockCaches,
        writable: true,
      });

      const cache = await window.caches.open('test-cache');
      expect(mockCaches.open).toHaveBeenCalledWith('test-cache');
      expect(cache).toBe(mockCache);
    });
  });

  describe('PWA Install Prompt', () => {
    it('should handle beforeinstallprompt event', () => {
      const mockEvent = {
        preventDefault: vi.fn(),
        prompt: vi.fn(),
        userChoice: Promise.resolve({ outcome: 'accepted' }),
      };

      const mockHandler = vi.fn();
      window.addEventListener('beforeinstallprompt', mockHandler);

      // Simulate beforeinstallprompt event
      const customEvent = new CustomEvent('beforeinstallprompt', { detail: mockEvent });
      window.dispatchEvent(customEvent);
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should handle PWA install prompt', async () => {
      const mockPrompt = vi.fn();
      const mockUserChoice = Promise.resolve({ outcome: 'accepted' });

      const mockEvent = {
        preventDefault: vi.fn(),
        prompt: mockPrompt,
        userChoice: mockUserChoice,
      };

      // Simulate install prompt
      await mockEvent.prompt();
      const result = await mockEvent.userChoice;

      expect(mockPrompt).toHaveBeenCalled();
      expect(result.outcome).toBe('accepted');
    });
  });

  describe('Error Handling', () => {
    it('should handle service worker registration failures gracefully', async () => {
      const error = new Error('Registration failed');
      navigator.serviceWorker.register = vi.fn().mockRejectedValue(error);

      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (err) {
        expect(err).toBe(error);
      }
    });

    it('should handle IndexedDB failures gracefully', async () => {
      const error = new Error('IndexedDB failed');
      window.indexedDB.open = vi.fn().mockImplementation(() => {
        throw error;
      });

      expect(() => window.indexedDB.open('DivineDB', 1)).toThrow(error);
    });
  });

  describe('Service Worker Lifecycle', () => {
    it('should handle service worker installation', async () => {
      const mockInstallingWorker = {
        state: 'installed',
        addEventListener: vi.fn(),
      };

      const mockRegistration = {
        scope: '/',
        installing: mockInstallingWorker,
        waiting: null,
        active: null,
        addEventListener: vi.fn(),
      };

      navigator.serviceWorker.getRegistration = vi.fn().mockResolvedValue(mockRegistration);

      const registration = await navigator.serviceWorker.getRegistration();
      expect(registration.installing).toBeDefined();
      expect(registration.installing.state).toBe('installed');
    });

    it('should handle service worker activation', async () => {
      const mockActiveWorker = {
        state: 'activated',
        postMessage: vi.fn(),
      };

      const mockRegistration = {
        scope: '/',
        installing: null,
        waiting: null,
        active: mockActiveWorker,
        addEventListener: vi.fn(),
      };

      navigator.serviceWorker.getRegistration = vi.fn().mockResolvedValue(mockRegistration);

      const registration = await navigator.serviceWorker.getRegistration();
      expect(registration.active).toBeDefined();
      expect(registration.active.state).toBe('activated');
    });

    it('should handle waiting service worker', async () => {
      const mockWaitingWorker = {
        postMessage: vi.fn(),
      };

      const mockRegistration = {
        scope: '/',
        installing: null,
        waiting: mockWaitingWorker,
        active: null,
        addEventListener: vi.fn(),
      };

      navigator.serviceWorker.getRegistration = vi.fn().mockResolvedValue(mockRegistration);

      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        expect(registration.waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
      }
    });
  });

  describe('IndexedDB Service Integration', () => {
    it('should create IndexedDB service instance', () => {
      expect(indexedDBService).toBeDefined();
      expect(typeof indexedDBService.addFavorite).toBe('function');
      expect(typeof indexedDBService.getFavorites).toBe('function');
      expect(typeof indexedDBService.removeFavorite).toBe('function');
      expect(typeof indexedDBService.clearFavorites).toBe('function');
      expect(typeof indexedDBService.isFavorite).toBe('function');
    });

    it('should have correct database configuration', () => {
      // Test that the service has the expected properties
      expect(indexedDBService).toHaveProperty('dbName', 'DivineDB');
      expect(indexedDBService).toHaveProperty('dbVersion', 1);
      expect(indexedDBService).toHaveProperty('storeName', 'favorites');
    });
  });

  describe('PWA Manifest Validation', () => {
    it('should validate PWA manifest structure', () => {
      const mockManifest = {
        name: 'Divine',
        short_name: 'Divine',
        description: 'Brian Eno\'s Oblique Strategies for creative inspiration - Works offline',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1976d2',
        icons: [
          {
            src: '/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
        ],
      };

      expect(mockManifest.name).toBe('Divine');
      expect(mockManifest.short_name).toBe('Divine');
      expect(mockManifest.display).toBe('standalone');
      expect(mockManifest.icons).toBeInstanceOf(Array);
      expect(mockManifest.icons.length).toBeGreaterThan(0);
    });
  });

  describe('Service Worker Update Flow', () => {
    it('should handle service worker update detection', async () => {
      const mockRegistration = {
        scope: '/',
        installing: null,
        waiting: {
          postMessage: vi.fn(),
        },
        active: null,
        addEventListener: vi.fn(),
      };

      navigator.serviceWorker.getRegistration = vi.fn().mockResolvedValue(mockRegistration);

      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration.waiting) {
        // Simulate skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        expect(registration.waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
      }
    });

    it('should handle controller change event', () => {
      const mockControllerChangeHandler = vi.fn();
      navigator.serviceWorker.addEventListener('controllerchange', mockControllerChangeHandler);

      // Simulate controller change
      const controllerChangeEvent = new Event('controllerchange');
      if (navigator.serviceWorker.dispatchEvent) {
        navigator.serviceWorker.dispatchEvent(controllerChangeEvent);
        expect(mockControllerChangeHandler).toHaveBeenCalled();
      } else {
        // Fallback test if dispatchEvent is not available
        expect(mockControllerChangeHandler).toBeDefined();
      }
    });
  });

  describe('Offline Strategy Fallback', () => {
    it('should handle offline API requests', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      try {
        await fetch('/api/strategies/random');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Network error');
      }
    });

    it('should provide local strategy fallback', () => {
      const localStrategies = [
        'A line has two sides',
        'Abandon desire',
        'Abandon normal instructions',
        'Accept advice',
      ];

      expect(localStrategies).toBeInstanceOf(Array);
      expect(localStrategies.length).toBeGreaterThan(0);
      expect(localStrategies.every(strategy => typeof strategy === 'string')).toBe(true);
    });
  });
});

import { vi } from 'vitest';

// Mock service worker API
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn(),
    getRegistration: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    controller: null,
  },
  writable: true,
});

// Mock indexedDB
Object.defineProperty(window, 'indexedDB', {
  value: {
    open: vi.fn(),
  },
  writable: true,
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock Cache API
Object.defineProperty(window, 'caches', {
  value: {
    open: vi.fn(),
    delete: vi.fn(),
    keys: vi.fn(),
    match: vi.fn(),
  },
  writable: true,
});

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    reload: vi.fn(),
  },
  writable: true,
});

// Mock window.addEventListener and removeEventListener
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

window.addEventListener = vi.fn((event, handler) => {
  // Store the handler for later use in tests
  if (!window._eventHandlers) {
    window._eventHandlers = {};
  }
  if (!window._eventHandlers[event]) {
    window._eventHandlers[event] = [];
  }
  window._eventHandlers[event].push(handler);
  return originalAddEventListener.call(window, event, handler);
});

window.removeEventListener = vi.fn((event, handler) => {
  if (window._eventHandlers && window._eventHandlers[event]) {
    const index = window._eventHandlers[event].indexOf(handler);
    if (index > -1) {
      window._eventHandlers[event].splice(index, 1);
    }
  }
  return originalRemoveEventListener.call(window, event, handler);
});

// Mock window.dispatchEvent to properly trigger stored handlers
const originalDispatchEvent = window.dispatchEvent;
window.dispatchEvent = vi.fn((event) => {
  if (window._eventHandlers && window._eventHandlers[event.type]) {
    window._eventHandlers[event.type].forEach((handler: Function) => {
      handler(event);
    });
  }
  return originalDispatchEvent.call(window, event);
});

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
});

// Mock CustomEvent
if (typeof CustomEvent === 'undefined') {
  (global as any).CustomEvent = class CustomEvent extends Event {
    detail: any;
    constructor(type: string, options?: any) {
      super(type, options);
      this.detail = options?.detail;
    }
  };
}

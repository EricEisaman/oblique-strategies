// IndexedDB service for favorites storage
export class IndexedDBService {
  private readonly dbName = 'DivineDB';
  private readonly dbVersion = 1;
  private readonly storeName = 'favorites';

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async addFavorite(strategy: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      // Check if strategy already exists by getting all and filtering
      const getRequest = store.getAll();
      getRequest.onsuccess = () => {
        const existing = getRequest.result.find((item: any) => item.strategy === strategy);
        if (existing) {
          resolve(); // Already exists
          return;
        }
        
        const addRequest = store.add({ strategy, timestamp: Date.now() });
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(addRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getFavorites(): Promise<string[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const favorites = request.result.map((item: any) => item.strategy);
        resolve(favorites);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async removeFavorite(strategy: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const item = request.result.find((item: any) => item.strategy === strategy);
        if (item) {
          const deleteRequest = store.delete(item.id);
          deleteRequest.onsuccess = () => resolve();
          deleteRequest.onerror = () => reject(deleteRequest.error);
        } else {
          resolve(); // Item not found
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearFavorites(): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async isFavorite(strategy: string): Promise<boolean> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const exists = request.result.some((item: any) => item.strategy === strategy);
        resolve(exists);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBService = new IndexedDBService();

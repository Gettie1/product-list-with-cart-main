import type { CartItem } from './types';

const DB_NAME = 'dessert-cart-db';
const STORE_NAME = 'cart';

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllCartItems(): Promise<CartItem[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addOrUpdateCartItem(item: CartItem): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const existing = store.get(item.id);

  existing.onsuccess = () => {
    const found = existing.result;
    if (found) {
      store.put({ ...found, quantity: found.quantity + 1 });
    } else {
      store.put({ ...item, quantity: 1 });
    }
  };
}

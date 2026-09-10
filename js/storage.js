/** @typedef {{ id: string, createdAt: number, sealedAt: number|null, status: "draft"|"sealed", scene: string, promptsUsed: string[], body: string, title: string, noContactUntil: number|null }} Letter */

const DB_NAME = "heal-local";
const STORE_NAME = "letters";
const LS_KEY = "heal-local-letters";
const MAX_BODY_LENGTH = 50_000;

/**
 * generateId returns a unique identifier for a letter.
 * @returns {string}
 */
function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * createMemoryBackend returns an in-memory Map-based storage backend for tests.
 * @returns {{ getAll: () => Promise<Letter[]>, put: (letter: Letter) => Promise<void>, delete: (id: string) => Promise<void> }}
 */
export function createMemoryBackend() {
  const map = new Map();
  return {
    async getAll() {
      return Array.from(map.values());
    },
    async put(letter) {
      map.set(letter.id, { ...letter });
    },
    async delete(id) {
      map.delete(id);
    },
  };
}

/**
 * createIndexedDBBackend wraps an IndexedDB database as a letter backend.
 * @param {IDBDatabase} db
 */
function createIndexedDBBackend(db) {
  return {
    async getAll() {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    },
    async put(letter) {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(letter);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    },
    async delete(id) {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    },
  };
}

/**
 * createLocalStorageBackend returns a localStorage-backed letter store.
 */
function createLocalStorageBackend() {
  return {
    async getAll() {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        return [];
      }
      return JSON.parse(raw);
    },
    async put(letter) {
      if (letter.body && letter.body.length > MAX_BODY_LENGTH) {
        throw new Error(`body exceeds ${MAX_BODY_LENGTH} characters`);
      }
      const all = await this.getAll();
      const idx = all.findIndex((item) => item.id === letter.id);
      if (idx >= 0) {
        all[idx] = letter;
      } else {
        all.push(letter);
      }
      localStorage.setItem(LS_KEY, JSON.stringify(all));
    },
    async delete(id) {
      const all = await this.getAll();
      const filtered = all.filter((item) => item.id !== id);
      localStorage.setItem(LS_KEY, JSON.stringify(filtered));
    },
  };
}

/**
 * tryOpenIndexedDB attempts to open the heal-local IndexedDB database.
 * @returns {Promise<{ getAll: () => Promise<Letter[]>, put: (letter: Letter) => Promise<void>, delete: (id: string) => Promise<void> }|null>}
 */
async function tryOpenIndexedDB() {
  if (typeof indexedDB === "undefined") {
    return null;
  }
  try {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE_NAME)) {
          req.result.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return createIndexedDBBackend(db);
  } catch {
    return null;
  }
}

/**
 * tryOpenLocalStorage attempts to use localStorage as a letter backend.
 * @returns {{ getAll: () => Promise<Letter[]>, put: (letter: Letter) => Promise<void>, delete: (id: string) => Promise<void> }|null}
 */
function tryOpenLocalStorage() {
  if (typeof localStorage === "undefined") {
    return null;
  }
  try {
    localStorage.setItem("__heal_test__", "1");
    localStorage.removeItem("__heal_test__");
    return createLocalStorageBackend();
  } catch {
    return null;
  }
}

/**
 * sortLetters orders sealed letters by sealedAt desc, then drafts.
 * @param {Letter[]} letters
 * @returns {Letter[]}
 */
function sortLetters(letters) {
  const sealed = letters
    .filter((item) => item.status === "sealed")
    .sort((a, b) => (b.sealedAt ?? 0) - (a.sealedAt ?? 0));
  const drafts = letters.filter((item) => item.status === "draft");
  return [...sealed, ...drafts];
}

/**
 * createStore builds the letter storage API on top of a backend.
 * @param {{ getAll: () => Promise<Letter[]>, put: (letter: Letter) => Promise<void>, delete: (id: string) => Promise<void> }} backend
 */
function createStore(backend) {
  return {
    async createDraft({ scene, promptsUsed, body, title }) {
      /** @type {Letter} */
      const letter = {
        id: generateId(),
        createdAt: Date.now(),
        sealedAt: null,
        status: "draft",
        scene,
        promptsUsed,
        body,
        title,
        noContactUntil: null,
      };
      await backend.put(letter);
      return { ...letter };
    },

    async saveDraft(letter) {
      if (letter.status === "sealed") {
        throw new Error("sealed letter is read-only");
      }
      await backend.put(letter);
      return { ...letter };
    },

    async seal(id, options = {}) {
      const all = await backend.getAll();
      const letter = all.find((item) => item.id === id);
      if (!letter) {
        throw new Error(`letter not found: ${id}`);
      }
      /** @type {Letter} */
      const sealed = {
        ...letter,
        status: "sealed",
        sealedAt: Date.now(),
        noContactUntil: options.noContactUntil ?? letter.noContactUntil ?? null,
      };
      await backend.put(sealed);
      return { ...sealed };
    },

    async get(id) {
      const all = await backend.getAll();
      const letter = all.find((item) => item.id === id);
      return letter ? { ...letter } : null;
    },

    async list() {
      const all = await backend.getAll();
      return sortLetters(all).map((item) => ({ ...item }));
    },

    async remove(id) {
      await backend.delete(id);
    },
  };
}

/**
 * openStorage opens letter storage using the given backend or browser defaults.
 * @param {{ getAll: () => Promise<Letter[]>, put: (letter: Letter) => Promise<void>, delete: (id: string) => Promise<void> }} [backend]
 * @returns {Promise<ReturnType<typeof createStore> & { backendName: string, isDegraded: boolean }>}
 */
export async function openStorage(backend) {
  let backendName = "indexeddb";
  let isDegraded = false;
  let resolved = backend;

  if (!resolved) {
    resolved = await tryOpenIndexedDB();
    if (!resolved) {
      resolved = tryOpenLocalStorage();
      if (resolved) {
        backendName = "localStorage";
        isDegraded = true;
      }
    }
  } else {
    backendName = "memory";
  }

  if (!resolved) {
    throw new Error("no storage backend available");
  }

  const store = createStore(resolved);
  store.backendName = backendName;
  store.isDegraded = isDegraded;
  return store;
}

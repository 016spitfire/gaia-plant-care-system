import { openDB } from "idb";

const DB_NAME = "gaia-plant-care";
const DB_VERSION = 1;

/**
 * Initialize and return the IndexedDB database
 * Creates object store for plants
 */
export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Create plants object store
      if (!db.objectStoreNames.contains("plants")) {
        const plantStore = db.createObjectStore("plants", { keyPath: "id" });

        // Index for querying plants by next watering date
        plantStore.createIndex("nextWatering", "nextWatering");

        // Index for querying by name (for future search feature)
        plantStore.createIndex("name", "name");
      }
    },
  });

  return db;
}

/**
 * Get the database instance
 * Creates it if it doesn't exist
 */
export async function getDB() {
  return await initDB();
}

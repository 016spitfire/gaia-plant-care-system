import { getDB } from './db';
import { addDays } from 'date-fns';

/**
 * Create a new plant
 * @param {Object} plantData - Plant data (name, species, photo, wateringFrequency, notes)
 * @returns {Promise<Object>} The created plant with generated fields
 */
export async function createPlant(plantData) {
  const db = await getDB();

  const now = new Date().toISOString();
  const plant = {
    id: crypto.randomUUID(),
    name: plantData.name,
    species: plantData.species || '',
    photo: plantData.photo || null, // Blob from compressed image
    wateringFrequency: plantData.wateringFrequency || 7, // Default 7 days
    lastWatered: plantData.lastWatered || now,
    nextWatering: plantData.nextWatering || addDays(new Date(plantData.lastWatered || now), plantData.wateringFrequency || 7).toISOString(),
    notes: plantData.notes || '',
    createdAt: now,
    updatedAt: now,
  };

  await db.add('plants', plant);
  return plant;
}

/**
 * Get all plants
 * @returns {Promise<Array>} Array of all plants
 */
export async function getAllPlants() {
  const db = await getDB();
  return await db.getAll('plants');
}

/**
 * Get a single plant by ID
 * @param {string} id - Plant ID
 * @returns {Promise<Object|undefined>} Plant object or undefined if not found
 */
export async function getPlant(id) {
  const db = await getDB();
  return await db.get('plants', id);
}

/**
 * Update a plant
 * @param {string} id - Plant ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated plant
 */
export async function updatePlant(id, updates) {
  const db = await getDB();
  const plant = await db.get('plants', id);

  if (!plant) {
    throw new Error(`Plant with id ${id} not found`);
  }

  const updatedPlant = {
    ...plant,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Recalculate nextWatering if lastWatered or wateringFrequency changed
  if (updates.lastWatered || updates.wateringFrequency) {
    const lastWatered = updates.lastWatered || plant.lastWatered;
    const frequency = updates.wateringFrequency || plant.wateringFrequency;
    updatedPlant.nextWatering = addDays(new Date(lastWatered), frequency).toISOString();
  }

  await db.put('plants', updatedPlant);
  return updatedPlant;
}

/**
 * Delete a plant
 * @param {string} id - Plant ID
 * @returns {Promise<void>}
 */
export async function deletePlant(id) {
  const db = await getDB();
  await db.delete('plants', id);
}

/**
 * Mark a plant as watered (updates lastWatered and recalculates nextWatering)
 * @param {string} id - Plant ID
 * @returns {Promise<Object>} Updated plant
 */
export async function waterPlant(id) {
  const now = new Date().toISOString();
  return await updatePlant(id, { lastWatered: now });
}

/**
 * Get plants that need watering today or earlier
 * @returns {Promise<Array>} Array of plants needing water
 */
export async function getPlantsNeedingWater() {
  const db = await getDB();
  const allPlants = await db.getAll('plants');
  const now = new Date();

  return allPlants.filter(plant => {
    const nextWatering = new Date(plant.nextWatering);
    return nextWatering <= now;
  });
}

/**
 * Get count of plants needing water (for badge)
 * @returns {Promise<number>} Count of plants needing water
 */
export async function getPlantsNeedingWaterCount() {
  const plants = await getPlantsNeedingWater();
  return plants.length;
}

import PlantCard from './PlantCard';

/**
 * Plant list component - displays grid of plant cards
 * @param {Array} plants - Array of plant objects
 * @param {Function} onWaterPlant - Callback when plant is watered
 * @param {Function} onPlantClick - Callback when plant card is clicked
 */
export default function PlantList({ plants, onWaterPlant, onPlantClick }) {
  if (plants.length === 0) {
    return (
      <div className="empty-state">
        <p>No plants yet!</p>
        <p>Add your first plant to get started.</p>
      </div>
    );
  }

  return (
    <div className="plant-list">
      {plants.map(plant => (
        <PlantCard
          key={plant.id}
          plant={plant}
          onWater={onWaterPlant}
          onClick={onPlantClick}
        />
      ))}
    </div>
  );
}

import { useState, useEffect } from "react";
import { blobToDataURL } from "../utils/imageCompression";
import { formatDate, getWateringStatus } from "../utils/scheduling";

/**
 * Plant card component - displays a single plant
 * @param {Object} plant - Plant object from database
 * @param {Function} onWater - Callback when "Water" button clicked
 * @param {Function} onClick - Callback when card is clicked
 */
export default function PlantCard({ plant, onWater, onClick }) {
  const [photoURL, setPhotoURL] = useState(null);
  const wateringStatus = getWateringStatus(plant.nextWatering);

  // Convert blob to data URL for display
  useEffect(() => {
    if (plant.photo) {
      blobToDataURL(plant.photo).then(setPhotoURL);
    }
  }, [plant.photo]);

  const handleWaterClick = (e) => {
    e.stopPropagation(); // Prevent card click when watering
    onWater?.(plant.id);
  };

  return (
    <div
      className={`plant-card ${wateringStatus.urgency}`}
      onClick={() => onClick?.(plant)}
    >
      {photoURL && (
        <div className="plant-photo">
          <img src={photoURL} alt={plant.name} />
        </div>
      )}

      <div className="plant-info">
        <h3>{plant.name}</h3>
        {plant.species && <p className="species">{plant.species}</p>}

        <div className="watering-info">
          <p className="status">{wateringStatus.message}</p>
          <p className="last-watered">
            Last watered: {formatDate(plant.lastWatered)}
          </p>
        </div>

        {plant.customFields &&
          Object.entries(plant.customFields).some(([_, value]) => value) && (
            <div className="card-custom-fields">
              {Object.entries(plant.customFields).map(
                ([fieldName, value]) =>
                  value && (
                    <div key={fieldName} className="custom-field-item">
                      <span className="field-label">{fieldName}:</span> {value}
                    </div>
                  ),
              )}
            </div>
          )}

        {wateringStatus.needsWater && (
          <button onClick={handleWaterClick} className="water-btn">
            💧 Water Now
          </button>
        )}
      </div>
    </div>
  );
}

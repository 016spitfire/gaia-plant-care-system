import { useState, useEffect } from "react";
import { blobToDataURL } from "../utils/imageCompression";
import {
  formatDate,
  formatRelativeTime,
  getWateringStatus,
} from "../utils/scheduling";
import { getCustomFields } from "../utils/customFields";

/**
 * Plant detail view - full information about a plant
 * @param {Object} plant - Plant object
 * @param {Function} onClose - Callback to close the detail view
 * @param {Function} onEdit - Callback to edit the plant
 * @param {Function} onDelete - Callback to delete the plant
 * @param {Function} onWater - Callback to water the plant
 */
export default function PlantDetail({
  plant,
  onClose,
  onEdit,
  onDelete,
  onWater,
}) {
  const [photoURL, setPhotoURL] = useState(null);
  const wateringStatus = getWateringStatus(plant.nextWatering);

  useEffect(() => {
    if (plant.photo) {
      blobToDataURL(plant.photo).then(setPhotoURL);
    }
  }, [plant.photo]);

  const handleWater = () => {
    onWater?.(plant.id);
    onClose?.();
  };

  const handleEdit = () => {
    onEdit?.(plant);
    onClose?.();
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${plant.name}?`)) {
      onDelete?.(plant.id);
      onClose?.();
    }
  };

  return (
    <div className="plant-detail-overlay" onClick={onClose}>
      <div className="plant-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {photoURL && (
          <div className="detail-photo">
            <img src={photoURL} alt={plant.name} />
          </div>
        )}

        <div className="detail-content">
          <h2>{plant.name}</h2>
          {plant.species && <p className="detail-species">{plant.species}</p>}

          <div className="detail-section">
            <h3>Watering Schedule</h3>
            <div className={`detail-status ${wateringStatus.urgency}`}>
              {wateringStatus.message}
            </div>
            <p>
              <strong>Last watered:</strong> {formatDate(plant.lastWatered)} (
              {formatRelativeTime(plant.lastWatered)})
            </p>
            <p>
              <strong>Next watering:</strong> {formatDate(plant.nextWatering)} (
              {formatRelativeTime(plant.nextWatering)})
            </p>
            <p>
              <strong>Frequency:</strong> Every {plant.wateringFrequency} days
            </p>
          </div>

          {plant.notes && (
            <div className="detail-section">
              <h3>Notes</h3>
              <p className="detail-notes">{plant.notes}</p>
            </div>
          )}

          {getCustomFields().length > 0 && (
            <div className="detail-section">
              <h3>Custom Fields</h3>
              {Object.entries(plant.customFields || {}).map(
                ([fieldName, value]) =>
                  value && (
                    <p key={fieldName}>
                      <strong>{fieldName}:</strong> {value}
                    </p>
                  ),
              )}
            </div>
          )}

          <div className="detail-section detail-meta">
            <p>
              <strong>Added:</strong> {formatDate(plant.createdAt)}
            </p>
            <p>
              <strong>Last updated:</strong> {formatDate(plant.updatedAt)}
            </p>
          </div>

          <div className="detail-actions">
            {wateringStatus.needsWater && (
              <button onClick={handleWater} className="btn-water">
                💧 Water Now
              </button>
            )}
            <button onClick={handleEdit} className="btn-edit">
              ✏️ Edit
            </button>
            <button onClick={handleDelete} className="btn-delete">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

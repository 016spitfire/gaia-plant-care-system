import { useState } from "react";
import CameraCapture from "./CameraCapture";
import { getCustomFields } from "../utils/customFields";

/**
 * Form for adding/editing plants
 * @param {Function} onSubmit - Callback with form data
 * @param {Function} onCancel - Callback when cancel is clicked
 * @param {Object} initialData - Initial plant data for editing (optional)
 */
export default function PlantForm({ onSubmit, onCancel, initialData = null }) {
  const customFields = getCustomFields();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    species: initialData?.species || "",
    wateringFrequency: initialData?.wateringFrequency || 7,
    notes: initialData?.notes || "",
    photo: initialData?.photo || null,
    photoPreview: null,
    customFields: initialData?.customFields || {},
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldName]: value,
      },
    }));
  };

  const handlePhotoCapture = (blob, previewURL) => {
    setFormData((prev) => ({
      ...prev,
      photo: blob,
      photoPreview: previewURL,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a plant name");
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <div className="plant-form-overlay">
      <div className="plant-form">
        <h2>{initialData ? "Edit Plant" : "Add New Plant"}</h2>

        <form onSubmit={handleSubmit}>
          <CameraCapture onPhotoCapture={handlePhotoCapture} />

          <div className="form-group">
            <label htmlFor="name">Plant Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Monstera Deliciosa"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="species">Species</label>
            <input
              id="species"
              name="species"
              type="text"
              value={formData.species}
              onChange={handleInputChange}
              placeholder="e.g., Monstera"
            />
          </div>

          <div className="form-group">
            <label htmlFor="wateringFrequency">Watering Frequency (days)</label>
            <input
              id="wateringFrequency"
              name="wateringFrequency"
              type="number"
              min="1"
              max="365"
              value={formData.wateringFrequency}
              onChange={handleInputChange}
            />
            <small>Water every {formData.wateringFrequency} days</small>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Care instructions, observations, etc."
              rows="3"
            />
          </div>

          {customFields.length > 0 && (
            <div className="custom-fields-section">
              <h3>Custom Fields</h3>
              {customFields.map((fieldName) => (
                <div key={fieldName} className="form-group">
                  <label htmlFor={`custom-${fieldName}`}>{fieldName}</label>
                  <input
                    id={`custom-${fieldName}`}
                    type="text"
                    value={formData.customFields[fieldName] || ""}
                    onChange={(e) =>
                      handleCustomFieldChange(fieldName, e.target.value)
                    }
                    placeholder={`Enter ${fieldName}`}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {initialData ? "Update Plant" : "Add Plant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  getCustomFields,
  addCustomField,
  renameCustomField,
  deleteCustomField
} from '../utils/customFields';

/**
 * Custom field management interface
 * @param {Function} onClose - Callback to close the manager
 * @param {Function} onFieldsChanged - Callback when fields are modified
 */
export default function CustomFieldManager({ onClose, onFieldsChanged }) {
  const [fields, setFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    setFields(getCustomFields());
  }, []);

  const handleAddField = () => {
    if (!newFieldName.trim()) {
      alert('Please enter a field name');
      return;
    }

    try {
      const updated = addCustomField(newFieldName);
      setFields(updated);
      setNewFieldName('');
      onFieldsChanged?.();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleStartEdit = (fieldName) => {
    setEditingField(fieldName);
    setEditingName(fieldName);
  };

  const handleSaveEdit = () => {
    if (!editingName.trim()) {
      alert('Field name cannot be empty');
      return;
    }

    try {
      const result = renameCustomField(editingField, editingName);
      setFields(result.fieldList);
      setEditingField(null);
      setEditingName('');
      onFieldsChanged?.();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditingName('');
  };

  const handleDeleteField = (fieldName) => {
    if (!confirm(`Delete field "${fieldName}"? This will remove it from all plants.`)) {
      return;
    }

    try {
      const updated = deleteCustomField(fieldName);
      setFields(updated);
      onFieldsChanged?.();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="custom-field-manager-overlay" onClick={onClose}>
      <div className="custom-field-manager" onClick={(e) => e.stopPropagation()}>
        <div className="manager-header">
          <h2>Manage Custom Fields</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="manager-content">
          <div className="add-field-section">
            <h3>Add New Field</h3>
            <div className="add-field-input">
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="e.g., Pot Size, Location, Last Fertilized"
                onKeyPress={(e) => e.key === 'Enter' && handleAddField()}
              />
              <button onClick={handleAddField} className="btn-add-field">
                Add Field
              </button>
            </div>
            <p className="field-hint">
              These fields will appear on all plants. You can fill them in individually.
            </p>
          </div>

          <div className="existing-fields-section">
            <h3>Existing Fields ({fields.length})</h3>
            {fields.length === 0 ? (
              <p className="no-fields">No custom fields yet. Add one above!</p>
            ) : (
              <ul className="field-list">
                {fields.map(fieldName => (
                  <li key={fieldName} className="field-item">
                    {editingField === fieldName ? (
                      <div className="field-edit">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                          autoFocus
                        />
                        <button onClick={handleSaveEdit} className="btn-save">
                          ✓
                        </button>
                        <button onClick={handleCancelEdit} className="btn-cancel-edit">
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="field-display">
                        <span className="field-name">{fieldName}</span>
                        <div className="field-actions">
                          <button
                            onClick={() => handleStartEdit(fieldName)}
                            className="btn-edit-field"
                          >
                            Rename
                          </button>
                          <button
                            onClick={() => handleDeleteField(fieldName)}
                            className="btn-delete-field"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="manager-footer">
          <button onClick={onClose} className="btn-done">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

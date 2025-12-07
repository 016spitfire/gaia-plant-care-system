const CUSTOM_FIELDS_KEY = 'gaia-custom-fields';

/**
 * Get all custom field names from localStorage
 * @returns {Array<string>} Array of field names
 */
export function getCustomFields() {
  const stored = localStorage.getItem(CUSTOM_FIELDS_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Add a new custom field
 * @param {string} fieldName - Name of the field to add
 * @returns {Array<string>} Updated field list
 */
export function addCustomField(fieldName) {
  const fields = getCustomFields();

  // Avoid duplicates (case-insensitive check)
  const exists = fields.some(f => f.toLowerCase() === fieldName.toLowerCase());
  if (exists) {
    throw new Error(`Field "${fieldName}" already exists`);
  }

  const updated = [...fields, fieldName.trim()];
  localStorage.setItem(CUSTOM_FIELDS_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Rename a custom field
 * @param {string} oldName - Current field name
 * @param {string} newName - New field name
 * @returns {Object} { fieldList, oldName, newName } for updating plants
 */
export function renameCustomField(oldName, newName) {
  const fields = getCustomFields();
  const index = fields.indexOf(oldName);

  if (index === -1) {
    throw new Error(`Field "${oldName}" not found`);
  }

  // Check if new name already exists
  const exists = fields.some(f => f.toLowerCase() === newName.toLowerCase() && f !== oldName);
  if (exists) {
    throw new Error(`Field "${newName}" already exists`);
  }

  const updated = [...fields];
  updated[index] = newName.trim();
  localStorage.setItem(CUSTOM_FIELDS_KEY, JSON.stringify(updated));

  return { fieldList: updated, oldName, newName };
}

/**
 * Delete a custom field
 * @param {string} fieldName - Name of the field to delete
 * @returns {Array<string>} Updated field list
 */
export function deleteCustomField(fieldName) {
  const fields = getCustomFields();
  const updated = fields.filter(f => f !== fieldName);
  localStorage.setItem(CUSTOM_FIELDS_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Reorder custom fields
 * @param {Array<string>} orderedFields - Fields in new order
 * @returns {Array<string>} Updated field list
 */
export function reorderCustomFields(orderedFields) {
  localStorage.setItem(CUSTOM_FIELDS_KEY, JSON.stringify(orderedFields));
  return orderedFields;
}

/**
 * Initialize custom fields object for a plant
 * Ensures all global fields exist with empty values
 * @param {Object} existingFields - Existing custom fields on plant (if any)
 * @returns {Object} Normalized custom fields object
 */
export function normalizeCustomFields(existingFields = {}) {
  const globalFields = getCustomFields();
  const normalized = { ...existingFields };

  // Add any missing fields with empty values
  globalFields.forEach(fieldName => {
    if (!(fieldName in normalized)) {
      normalized[fieldName] = '';
    }
  });

  return normalized;
}

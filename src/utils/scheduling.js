import { addDays, formatDistanceToNow, format, isPast, isToday } from 'date-fns';

/**
 * Calculate the next watering date
 * @param {Date|string} lastWatered - Last watered date
 * @param {number} frequency - Days between watering
 * @returns {Date} Next watering date
 */
export function calculateNextWatering(lastWatered, frequency) {
  const date = typeof lastWatered === 'string' ? new Date(lastWatered) : lastWatered;
  return addDays(date, frequency);
}

/**
 * Check if a plant needs watering
 * @param {Date|string} nextWatering - Next watering date
 * @returns {boolean} True if plant needs watering
 */
export function needsWatering(nextWatering) {
  const date = typeof nextWatering === 'string' ? new Date(nextWatering) : nextWatering;
  return isPast(date) || isToday(date);
}

/**
 * Format a date for display
 * @param {Date|string} date - Date to format
 * @param {string} formatString - Format string (default: 'MMM d, yyyy')
 * @returns {string} Formatted date
 */
export function formatDate(date, formatString = 'MMM d, yyyy') {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
}

/**
 * Format a date as relative time (e.g., "2 days ago", "in 3 days")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Get a human-readable status for a plant's watering schedule
 * @param {Date|string} nextWatering - Next watering date
 * @returns {Object} Status object with message and urgency level
 */
export function getWateringStatus(nextWatering) {
  const date = typeof nextWatering === 'string' ? new Date(nextWatering) : nextWatering;

  if (isToday(date)) {
    return {
      message: 'Water today',
      urgency: 'high',
      needsWater: true,
    };
  }

  if (isPast(date)) {
    return {
      message: `Overdue ${formatRelativeTime(date)}`,
      urgency: 'critical',
      needsWater: true,
    };
  }

  return {
    message: `Water ${formatRelativeTime(date)}`,
    urgency: 'normal',
    needsWater: false,
  };
}

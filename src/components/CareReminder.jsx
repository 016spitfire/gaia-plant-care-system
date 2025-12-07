/**
 * Care reminder banner - shows plants needing attention
 * @param {number} count - Number of plants needing water
 * @param {Function} onClick - Callback when banner is clicked
 */
export default function CareReminder({ count, onClick }) {
  if (count === 0) return null;

  return (
    <div className="care-reminder" onClick={onClick}>
      <span className="reminder-icon">💧</span>
      <span className="reminder-text">
        {count === 1
          ? '1 plant needs water today'
          : `${count} plants need water today`}
      </span>
      <span className="reminder-arrow">→</span>
    </div>
  );
}

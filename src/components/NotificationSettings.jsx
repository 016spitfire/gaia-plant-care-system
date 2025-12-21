import { useState, useEffect } from "react";
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  scheduleDailyReminder,
  cancelDailyReminder,
  sendTestNotification,
} from "../utils/notifications";

/**
 * Notification Settings Component
 * Allows users to enable/disable notifications and set reminder time
 */
export default function NotificationSettings({ onClose }) {
  const [permission, setPermission] = useState(getNotificationPermission());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState({ hour: 8, minute: 0 });
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Load saved settings
    const savedTime = localStorage.getItem('notification-time');
    if (savedTime) {
      setReminderTime(JSON.parse(savedTime));
    }

    const enabled = localStorage.getItem('notifications-enabled') === 'true';
    setNotificationsEnabled(enabled && permission === 'granted');
  }, [permission]);

  const handleEnableNotifications = async () => {
    if (permission !== 'granted') {
      setIsRequesting(true);
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);
      setIsRequesting(false);

      if (newPermission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('notifications-enabled', 'true');
        scheduleDailyReminder(reminderTime.hour, reminderTime.minute);

        // Send test notification
        await sendTestNotification();
      } else {
        alert('Notification permission was denied. Please enable it in your browser settings.');
      }
    } else {
      setNotificationsEnabled(true);
      localStorage.setItem('notifications-enabled', 'true');
      scheduleDailyReminder(reminderTime.hour, reminderTime.minute);
    }
  };

  const handleDisableNotifications = () => {
    setNotificationsEnabled(false);
    localStorage.setItem('notifications-enabled', 'false');
    cancelDailyReminder();
  };

  const handleTimeChange = (e) => {
    const [hour, minute] = e.target.value.split(':').map(Number);
    const newTime = { hour, minute };
    setReminderTime(newTime);

    // If notifications are enabled, reschedule
    if (notificationsEnabled) {
      scheduleDailyReminder(hour, minute);
    }
  };

  const handleTestNotification = async () => {
    const success = await sendTestNotification();
    if (!success) {
      alert('Could not send test notification. Please check permissions.');
    }
  };

  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  if (!isNotificationSupported()) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>🔔 Notifications</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="settings-body">
            <div className="notification-unsupported">
              <p>⚠️ Notifications are not supported in this browser.</p>
              <p>Please use Chrome, Edge, or Firefox for notification support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔔 Notification Settings</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-body">
          {permission === 'denied' && (
            <div className="notification-warning">
              <p>❌ Notification permission was denied.</p>
              <p>To enable notifications, please update your browser settings.</p>
            </div>
          )}

          <div className="setting-group">
            <div className="setting-row">
              <div className="setting-info">
                <strong>Daily Reminders</strong>
                <p className="setting-description">
                  Get a daily notification when plants need water
                </p>
              </div>
              {notificationsEnabled ? (
                <button className="btn-danger" onClick={handleDisableNotifications}>
                  Disable
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={handleEnableNotifications}
                  disabled={isRequesting}
                >
                  {isRequesting ? 'Requesting...' : 'Enable'}
                </button>
              )}
            </div>
          </div>

          {notificationsEnabled && (
            <>
              <div className="setting-group">
                <label htmlFor="reminder-time">
                  <strong>Reminder Time</strong>
                </label>
                <input
                  id="reminder-time"
                  type="time"
                  value={formatTime(reminderTime.hour, reminderTime.minute)}
                  onChange={handleTimeChange}
                  className="time-input"
                />
                <p className="setting-description">
                  You'll receive one notification per day at this time
                </p>
              </div>

              <div className="setting-group">
                <button className="btn-secondary" onClick={handleTestNotification}>
                  Send Test Notification
                </button>
              </div>
            </>
          )}

          <div className="notification-info">
            <h3>How it works:</h3>
            <ul>
              <li>📱 One notification per day (not one per plant)</li>
              <li>🌱 Only notifies when plants need water</li>
              <li>🔢 Shows count of plants needing attention</li>
              <li>📍 Works on Android with background notifications</li>
              <li>🍎 iOS shows alerts when app is opened</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-done" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

/**
 * Notification utilities for PWA push notifications
 */

/**
 * Check if notifications are supported in this browser
 */
export function isNotificationSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get current notification permission status
 * @returns {'default'|'granted'|'denied'}
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request notification permission from user
 * @returns {Promise<'granted'|'denied'|'default'>}
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  // Request permission
  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Schedule daily reminder notification
 * @param {number} hour - Hour of day (0-23)
 * @param {number} minute - Minute (0-59)
 */
export function scheduleDailyReminder(hour = 8, minute = 0) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  // Cancel existing alarms
  cancelDailyReminder();

  // Calculate next notification time
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hour, minute, 0, 0);

  // If scheduled time is in the past today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delay = scheduledTime.getTime() - now.getTime();

  // Store the timeout ID
  const timeoutId = setTimeout(() => {
    checkAndNotify();
    // Reschedule for next day
    scheduleDailyReminder(hour, minute);
  }, delay);

  // Store for cancellation
  localStorage.setItem('notification-timeout-id', timeoutId);
  localStorage.setItem('notification-time', JSON.stringify({ hour, minute }));
}

/**
 * Cancel scheduled daily reminder
 */
export function cancelDailyReminder() {
  const timeoutId = localStorage.getItem('notification-timeout-id');
  if (timeoutId) {
    clearTimeout(parseInt(timeoutId, 10));
    localStorage.removeItem('notification-timeout-id');
  }
}

/**
 * Check plants needing water and send notification if any
 */
export async function checkAndNotify() {
  if (Notification.permission !== 'granted') {
    return;
  }

  try {
    // Dynamic import to avoid circular dependencies
    const { getPlantsNeedingWater } = await import('../db/plants');
    const plantsNeedingWater = await getPlantsNeedingWater();

    if (plantsNeedingWater.length === 0) {
      return;
    }

    // Update badge count
    await updateBadgeCount(plantsNeedingWater.length);

    // Send notification via service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Use service worker for background notification
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('🌱 Gaia Plant Care', {
        body: `${plantsNeedingWater.length} plant${plantsNeedingWater.length > 1 ? 's' : ''} need${plantsNeedingWater.length === 1 ? 's' : ''} water today`,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'daily-reminder',
        requireInteraction: false,
        data: {
          url: '/',
          plants: plantsNeedingWater.length
        }
      });
    } else {
      // Fallback to regular notification
      const notification = new Notification('🌱 Gaia Plant Care', {
        body: `${plantsNeedingWater.length} plant${plantsNeedingWater.length > 1 ? 's' : ''} need${plantsNeedingWater.length === 1 ? 's' : ''} water today`,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

/**
 * Update app badge count
 * @param {number} count - Number to show on badge
 */
export async function updateBadgeCount(count) {
  if ('setAppBadge' in navigator) {
    try {
      if (count > 0) {
        await navigator.setAppBadge(count);
      } else {
        await navigator.clearAppBadge();
      }
    } catch (error) {
      console.warn('Badge API not supported:', error);
    }
  }
}

/**
 * Clear app badge
 */
export async function clearBadge() {
  if ('clearAppBadge' in navigator) {
    try {
      await navigator.clearAppBadge();
    } catch (error) {
      console.warn('Badge API not supported:', error);
    }
  }
}

/**
 * Send a test notification immediately
 */
export async function sendTestNotification() {
  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return false;
  }

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('🌱 Gaia Test', {
        body: 'Notifications are working! You\'ll receive daily reminders.',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'test-notification',
      });
    } else {
      new Notification('🌱 Gaia Test', {
        body: 'Notifications are working! You\'ll receive daily reminders.',
        icon: '/pwa-192x192.png',
      });
    }
    return true;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
}

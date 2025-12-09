import { useState, useEffect } from "react";

/**
 * PWA Install Prompt Banner
 * Shows at bottom of screen when app is not installed
 * Hides when installed or dismissed
 */
export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone
      || document.referrer.includes('android-app://');

    if (isStandalone) {
      // App is installed, don't show prompt
      return;
    }

    // Check if user previously dismissed prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // For browsers that don't support beforeinstallprompt (like iOS Safari)
    // Show a generic message after a short delay
    const timer = setTimeout(() => {
      if (!deferredPrompt) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // On iOS or browsers without install prompt API
      // Just close and let user figure it out via browser menu
      setShowPrompt(false);
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="install-prompt">
      <div className="install-content">
        <span className="install-icon">📱</span>
        <div className="install-text">
          <strong>Install Gaia</strong>
          <span className="install-message">
            Add to your home screen for the best experience
          </span>
        </div>
        <div className="install-actions">
          <button className="install-btn" onClick={handleInstallClick}>
            Install
          </button>
          <button className="dismiss-btn" onClick={handleDismiss} aria-label="Dismiss">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

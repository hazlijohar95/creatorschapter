import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  canShare: boolean;
  updateAvailable: boolean;
}

interface PWAActions {
  install: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
  share: (data: ShareData) => Promise<void>;
  showNotification: (title: string, options?: NotificationOptions) => Promise<void>;
}

export function usePWA(): PWAState & PWAActions {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Check if app is installed/standalone
  useEffect(() => {
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');
      
      setIsStandalone(standalone);
      setIsInstalled(standalone);
    };

    checkStandalone();
    
    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkStandalone);
    
    return () => mediaQuery.removeEventListener('change', checkStandalone);
  }, []);

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      logger.info('PWA install prompt available');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      
      logger.info('PWA installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      logger.info('App came online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      logger.info('App went offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for service worker updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
        logger.info('Service worker update available');
      });
    }
  }, []);

  // Install PWA
  const install = async (): Promise<void> => {
    if (!deferredPrompt) {
      throw new Error('Install prompt not available');
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        logger.info('PWA install accepted');
      } else {
        logger.info('PWA install dismissed');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      logger.error('PWA install failed', error);
      throw error;
    }
  };

  // Check for updates
  const checkForUpdates = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          logger.info('Checked for service worker updates');
        }
      } catch (error) {
        logger.error('Failed to check for updates', error);
        throw error;
      }
    }
  };

  // Share content
  const share = async (data: ShareData): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        logger.info('Content shared successfully');
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          logger.info('Share cancelled by user');
        } else {
          logger.error('Share failed', error);
          throw error;
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      if (navigator.clipboard && data.url) {
        await navigator.clipboard.writeText(data.url);
        logger.info('URL copied to clipboard as fallback');
      } else {
        throw new Error('Sharing not supported');
      }
    }
  };

  // Show notification
  const showNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    let permission = Notification.permission;
    
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          ...options
        });
        logger.info('Notification shown');
      } else {
        new Notification(title, options);
        logger.info('Browser notification shown');
      }
    } else {
      throw new Error('Notification permission denied');
    }
  };

  return {
    // State
    isInstallable,
    isInstalled,
    isStandalone,
    isOnline,
    canShare: !!navigator.share,
    updateAvailable,
    
    // Actions
    install,
    checkForUpdates,
    share,
    showNotification
  };
}
import React, { useState } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

interface PWAInstallPromptProps {
  onDismiss?: () => void;
  className?: string;
}

export function PWAInstallPrompt({ onDismiss, className }: PWAInstallPromptProps) {
  const { isInstallable, install } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await install();
      setIsDismissed(true);
      onDismiss?.();
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <Card className={cn(
      "fixed bottom-20 left-4 right-4 z-50 shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 md:hidden",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Install Creator Chapter
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Get the full app experience with offline access, push notifications, and faster loading.
            </p>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleInstall}
                disabled={isInstalling}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                {isInstalling ? 'Installing...' : 'Install'}
              </Button>
              
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 h-8 px-3 text-xs"
              >
                Not now
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Banner version for less intrusive display
export function PWAInstallBanner({ onDismiss, className }: PWAInstallPromptProps) {
  const { isInstallable, install } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await install();
      setIsDismissed(true);
      onDismiss?.();
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div className={cn(
      "bg-blue-600 text-white px-4 py-3 flex items-center justify-between md:hidden",
      className
    )}>
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <Smartphone className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            Install Creator Chapter for a better experience
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 ml-3">
        <Button
          onClick={handleInstall}
          disabled={isInstalling}
          variant="secondary"
          size="sm"
          className="bg-white text-blue-600 hover:bg-gray-100 h-8 px-3 text-xs"
        >
          {isInstalling ? 'Installing...' : 'Install'}
        </Button>
        
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="text-white hover:text-gray-200 p-1 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
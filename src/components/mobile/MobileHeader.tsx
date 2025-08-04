import React from 'react';
import { ArrowLeft, Menu, Search, Bell, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  rightAction?: React.ReactNode;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  className?: string;
}

export function MobileHeader({
  title,
  showBack = false,
  showMenu = false,
  showSearch = false,
  showNotifications = false,
  rightAction,
  onMenuClick,
  onSearchClick,
  onNotificationClick,
  className
}: MobileHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuthStore();

  const handleBack = () => {
    navigate(-1);
  };

  // Auto-generate title based on route if not provided
  const getPageTitle = () => {
    if (title) return title;
    
    const path = location.pathname;
    if (path.includes('opportunities')) return 'Opportunities';
    if (path.includes('portfolio')) return 'Portfolio';
    if (path.includes('collaborations')) return 'Collaborations';
    if (path.includes('settings')) return 'Settings';
    if (path.includes('campaigns')) return 'Campaigns';
    if (path.includes('creators')) return 'Creators';
    if (path.includes('messaging')) return 'Messages';
    if (path.includes('applications')) return 'Applications';
    if (path.includes('analytics')) return 'Analytics';
    if (path.includes('creator-dashboard')) return 'Dashboard';
    if (path.includes('brand-dashboard')) return 'Dashboard';
    
    return 'Creator Chapter';
  };

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full bg-white border-b border-gray-200 md:hidden",
      className
    )}>
      <div className="flex items-center justify-between px-4 py-3 h-14">
        {/* Left Section */}
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          {showMenu && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="p-2 h-8 w-8"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}

          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1">
          {showSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchClick}
              className="p-2 h-8 w-8"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {showNotifications && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotificationClick}
              className="p-2 h-8 w-8 relative"
            >
              <Bell className="h-4 w-4" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                3
              </span>
            </Button>
          )}

          {rightAction && rightAction}
        </div>
      </div>
    </header>
  );
}

// Specialized headers for different sections
export function DashboardHeader() {
  return (
    <MobileHeader
      showNotifications
      showSearch
      onSearchClick={() => {
        // Open search modal
        console.log('Search clicked');
      }}
      onNotificationClick={() => {
        // Open notifications
        console.log('Notifications clicked');
      }}
    />
  );
}

export function DetailHeader({ title }: { title?: string }) {
  return (
    <MobileHeader
      title={title}
      showBack
    />
  );
}

export function SettingsHeader() {
  return (
    <MobileHeader
      title="Settings"
      showBack
    />
  );
}
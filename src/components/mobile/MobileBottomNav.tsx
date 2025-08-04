import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  MessageSquare, 
  User, 
  Briefcase,
  Settings,
  PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const creatorNavItems: NavItem[] = [
  { icon: Home, label: 'Overview', path: '/creator-dashboard' },
  { icon: Search, label: 'Opportunities', path: '/creator-dashboard/opportunities' },
  { icon: Briefcase, label: 'Portfolio', path: '/creator-dashboard/portfolio' },
  { icon: MessageSquare, label: 'Messages', path: '/creator-dashboard/collaborations' },
  { icon: User, label: 'Profile', path: '/creator-dashboard/settings' },
];

const brandNavItems: NavItem[] = [
  { icon: Home, label: 'Overview', path: '/brand-dashboard' },
  { icon: Search, label: 'Creators', path: '/brand-dashboard/creators' },
  { icon: PlusCircle, label: 'Campaigns', path: '/brand-dashboard/campaigns' },
  { icon: MessageSquare, label: 'Messages', path: '/brand-dashboard/messaging' },
  { icon: Settings, label: 'Settings', path: '/brand-dashboard/settings' },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { profile } = useAuthStore();

  if (!profile) return null;

  const navItems = profile.role === 'creator' ? creatorNavItems : brandNavItems;

  // Don't show on auth pages or public pages
  if (location.pathname.includes('/auth') || 
      location.pathname === '/' || 
      location.pathname.includes('/onboarding')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around px-1 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path !== '/creator-dashboard' && 
                           item.path !== '/brand-dashboard' && 
                           location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 relative",
                isActive 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mb-1 transition-transform duration-200",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-xs font-medium truncate w-full text-center leading-tight",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
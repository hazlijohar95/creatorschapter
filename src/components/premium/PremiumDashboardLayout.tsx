import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumDashboardLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function PremiumDashboardLayout({ 
  children, 
  header, 
  sidebar, 
  className 
}: PremiumDashboardLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20",
      "relative overflow-hidden",
      className
    )}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)`
        }} />
      </div>
      
      {/* Main content area */}
      <div className="relative z-10">
        {header && (
          <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-sm">
            {header}
          </header>
        )}
        
        <div className="flex">
          {sidebar && (
            <aside className="hidden lg:block w-64 h-[calc(100vh-64px)] sticky top-16 backdrop-blur-xl bg-white/40 border-r border-white/20">
              {sidebar}
            </aside>
          )}
          
          <main className="flex-1 p-6 lg:p-8 space-y-8">
            {children}
          </main>
        </div>
      </div>
      
      {/* Floating elements for premium feel */}
      <div className="fixed top-20 right-20 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-20 left-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />
    </div>
  );
}
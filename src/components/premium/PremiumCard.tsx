import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  gradient?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function PremiumCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  gradient = "from-blue-500/10 to-purple-500/10",
  className,
  children,
  onClick
}: PremiumCardProps) {
  const trendColors = {
    up: "text-emerald-600 bg-emerald-50",
    down: "text-red-600 bg-red-50", 
    neutral: "text-slate-600 bg-slate-50"
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer",
        "bg-gradient-to-br bg-white/50 backdrop-blur-sm",
        gradient && `before:absolute before:inset-0 before:bg-gradient-to-br before:${gradient} before:opacity-60`,
        onClick && "hover:scale-[1.02] hover:-translate-y-1",
        className
      )}
      onClick={onClick}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors">
            {title}
          </CardTitle>
          {Icon && (
            <div className="p-2 rounded-xl bg-white/60 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
              <Icon className="h-4 w-4 text-slate-600" />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-0">
        <div className="space-y-3">
          <div className="text-3xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
            {value}
          </div>
          
          {(description || trendValue) && (
            <div className="flex items-center justify-between">
              {description && (
                <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">
                  {description}
                </p>
              )}
              
              {trendValue && trend && (
                <span className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300",
                  trendColors[trend],
                  "group-hover:scale-105"
                )}>
                  {trend === 'up' && '↗'} 
                  {trend === 'down' && '↘'} 
                  {trendValue}
                </span>
              )}
            </div>
          )}
          
          {children}
        </div>
      </CardContent>
      
      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-lg border border-white/20 group-hover:border-white/40 transition-colors duration-300" />
    </Card>
  );
}
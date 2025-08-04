import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobilePullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  disabled?: boolean;
}

export function MobilePullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  className,
  disabled = false
}: MobilePullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Only allow pull to refresh when scrolled to top
    if (container.scrollTop > 0) return;

    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (disabled || !isDragging.current) return;

    const container = containerRef.current;
    if (!container || container.scrollTop > 0) {
      isDragging.current = false;
      return;
    }

    currentY.current = e.touches[0].clientY;
    const distance = Math.max(0, currentY.current - startY.current);

    if (distance > 0) {
      e.preventDefault();
      
      // Apply rubber band effect
      const rubberBandDistance = Math.min(distance * 0.6, threshold * 1.5);
      setPullDistance(rubberBandDistance);
      setCanRefresh(rubberBandDistance >= threshold);
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || !isDragging.current) return;

    isDragging.current = false;

    if (canRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }

    // Reset state
    setPullDistance(0);
    setCanRefresh(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled]);

  const refreshIndicatorHeight = Math.min(pullDistance, threshold);
  const refreshOpacity = Math.min(pullDistance / threshold, 1);
  const iconRotation = isRefreshing ? 360 : (pullDistance / threshold) * 180;

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-auto h-full",
        className
      )}
      style={{
        transform: `translateY(${isRefreshing ? threshold : refreshIndicatorHeight}px)`,
        transition: isRefreshing || (!isDragging.current && pullDistance > 0) 
          ? 'transform 0.3s ease-out' 
          : 'none'
      }}
    >
      {/* Pull to refresh indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-gray-50 border-b border-gray-200"
        style={{
          height: `${Math.max(refreshIndicatorHeight, isRefreshing ? threshold : 0)}px`,
          transform: `translateY(-${Math.max(refreshIndicatorHeight, isRefreshing ? threshold : 0)}px)`,
          opacity: refreshOpacity,
          transition: isRefreshing || (!isDragging.current && pullDistance > 0) 
            ? 'all 0.3s ease-out' 
            : 'none'
        }}
      >
        <div className="flex flex-col items-center space-y-2">
          <RefreshCw 
            className={cn(
              "w-5 h-5 text-gray-600 transition-transform duration-200",
              isRefreshing && "animate-spin"
            )}
            style={{
              transform: `rotate(${iconRotation}deg)`
            }}
          />
          <span className="text-xs text-gray-600 font-medium">
            {isRefreshing 
              ? 'Refreshing...' 
              : canRefresh 
                ? 'Release to refresh' 
                : 'Pull to refresh'
            }
          </span>
        </div>
      </div>

      {children}
    </div>
  );
}
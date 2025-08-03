// src/components/shared/QuickSkeleton.tsx
import React from "react";

interface QuickSkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  children?: React.ReactNode;
}

export function QuickSkeleton({ 
  className = "", 
  height = "h-4", 
  width = "w-full",
  children 
}: QuickSkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${height} ${width} ${className}`}>
      {children}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <QuickSkeleton height="h-8" width="w-48" />
          <QuickSkeleton height="h-4" width="w-96" />
        </div>
        <div className="space-y-4">
          <QuickSkeleton height="h-12" />
          <QuickSkeleton height="h-12" />
          <QuickSkeleton height="h-12" />
        </div>
      </div>
    </div>
  );
}

export function OnboardingSkeleton() {
  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="border rounded-lg p-6 bg-white/90 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <QuickSkeleton height="h-8" width="w-48" />
            <QuickSkeleton height="h-6" width="w-20" />
          </div>
          <QuickSkeleton height="h-4" width="w-72" />
          <div className="space-y-4">
            <QuickSkeleton height="h-10" />
            <QuickSkeleton height="h-10" />
            <QuickSkeleton height="h-24" />
            <QuickSkeleton height="h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4">
        <QuickSkeleton height="h-8" width="w-48" className="mx-auto" />
        <div className="space-y-4 p-6 border rounded-lg">
          <QuickSkeleton height="h-10" />
          <QuickSkeleton height="h-10" />
          <QuickSkeleton height="h-10" />
          <QuickSkeleton height="h-12" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-3 w-full max-w-md p-6">
        <QuickSkeleton height="h-6" width="w-32" className="mx-auto" />
        <QuickSkeleton height="h-4" width="w-48" className="mx-auto" />
      </div>
    </div>
  );
}
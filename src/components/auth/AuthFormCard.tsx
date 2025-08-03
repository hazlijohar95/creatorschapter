
import React from "react";
import AuthGlassCard from "./AuthGlassCard";
import AuthPremiumHeader from "./AuthPremiumHeader";
import { QuickSkeleton } from "@/components/shared/QuickSkeleton";
import ConfettiCheck from "@/components/ConfettiCheck";

type AuthFormCardProps = {
  isSignUp: boolean;
  isLoading: boolean;
  celebrating: boolean;
  children: React.ReactNode;
};

export default function AuthFormCard({
  isSignUp,
  isLoading,
  celebrating,
  children
}: AuthFormCardProps) {
  return (
    <AuthGlassCard>
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="space-y-2">
            <QuickSkeleton height="h-4" width="w-32" className="mx-auto" />
            <QuickSkeleton height="h-3" width="w-24" className="mx-auto" />
          </div>
        </div>
      )}
      {celebrating && <ConfettiCheck />}
      <AuthPremiumHeader isSignUp={isSignUp} />
      {children}
    </AuthGlassCard>
  );
}


import React from "react";
import AuthGlassCard from "./AuthGlassCard";
import AuthPremiumHeader from "./AuthPremiumHeader";
import LoadingOverlay from "@/components/LoadingOverlay";
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
      {isLoading && <LoadingOverlay />}
      {celebrating && <ConfettiCheck />}
      <AuthPremiumHeader isSignUp={isSignUp} />
      {children}
    </AuthGlassCard>
  );
}

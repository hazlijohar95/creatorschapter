import React from 'react';
import { useAuthStore } from "@/lib/auth";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function OnboardingDebugInfo() {
  const { user, profile } = useAuthStore();
  const { authFlowType, isNewUser, isExistingUser } = useAuthFlow();
  const { step1Complete, step2Complete } = useProfileCompletion();
  const navigate = useNavigate();

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-sm text-orange-800">Debug Info (Dev Only)</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-orange-700 space-y-2">
        <div><strong>Auth Flow:</strong> {authFlowType}</div>
        <div><strong>Is New User:</strong> {isNewUser ? 'Yes' : 'No'}</div>
        <div><strong>Is Existing User:</strong> {isExistingUser ? 'Yes' : 'No'}</div>
        <div><strong>User Created:</strong> {user?.created_at}</div>
        <div><strong>Has Profile:</strong> {profile ? 'Yes' : 'No'}</div>
        <div><strong>Username:</strong> {profile?.username || 'None'}</div>
        <div><strong>Full Name:</strong> {profile?.full_name || 'None'}</div>
        <div><strong>Email:</strong> {profile?.email || user?.email || 'None'}</div>
        <div><strong>Step 1 Complete:</strong> {step1Complete ? 'Yes' : 'No'}</div>
        <div><strong>Step 2 Complete:</strong> {step2Complete ? 'Yes' : 'No'}</div>
        
        <div className="pt-2">
          <Button 
            size="sm" 
            onClick={() => navigate("/creator-dashboard")}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Force Skip to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
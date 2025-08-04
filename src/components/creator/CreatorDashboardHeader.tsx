import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";
import { ProfileCompletion } from "@/components/shared/ProfileCompletion";
import { useToast } from "@/hooks/use-toast";

export function CreatorDashboardHeader() {
  const { profile, refreshProfile } = useAuthStore();
  const { toast } = useToast();
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);

  // Check if profile has missing critical fields
  const missingFields = [];
  if (!profile?.username) missingFields.push('username');
  if (!profile?.full_name) missingFields.push('full_name');

  const hasIncompleteProfile = missingFields.length > 0;

  const handleCompleteProfile = () => {
    setShowProfileCompletion(true);
  };

  const handleProfileCompleted = () => {
    setShowProfileCompletion(false);
    toast({
      title: "Profile completed!",
      description: "Your profile has been updated successfully."
    });
  };

  const handleSkipCompletion = () => {
    setShowProfileCompletion(false);
  };

  if (!hasIncompleteProfile) {
    return null; // Don't show anything if profile is complete
  }

  return (
    <>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-yellow-800">Complete Your Profile</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Add missing information to improve your visibility to brands.
            </p>
          </div>
          <Button 
            onClick={handleCompleteProfile}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Complete Now
          </Button>
        </div>
      </div>

      {showProfileCompletion && (
        <ProfileCompletion
          missingFields={missingFields}
          onComplete={handleProfileCompleted}
          onSkip={handleSkipCompletion}
        />
      )}
    </>
  );
}
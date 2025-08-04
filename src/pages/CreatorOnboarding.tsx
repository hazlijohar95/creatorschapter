import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import Step1Identity from "../components/onboarding/Step1Identity";
import Step2Portfolio from "../components/onboarding/Step2Portfolio";
import { OnboardingDebugInfo } from "../components/onboarding/OnboardingDebugInfo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { OnboardingSkeleton } from "@/components/shared/QuickSkeleton";

const TOTAL_STEPS = 2;

export default function CreatorOnboarding() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  
  const { step1Complete, step2Complete, loading, refetch } = useProfileCompletion();
  const { isExistingUser } = useAuthFlow();
  const [step, setStep] = useState(1);

  // Handle automatic navigation if onboarding already completed OR if this is an existing user
  useEffect(() => {
    if (step2Complete) {
      navigate("/creator-dashboard");
      return;
    }

    // If this is an existing user (sign-in), redirect them immediately to dashboard
    if (isExistingUser && profile) {
      console.log("Existing user detected, bypassing onboarding", { userId: user?.id, hasProfile: !!profile });
      navigate("/creator-dashboard");
      return;
    }

    // Also check if user already has a profile with basic info (fallback)
    if (profile?.username && profile?.full_name) {
      console.log("User has complete profile, skipping onboarding", { 
        userId: user?.id, 
        username: profile.username,
        fullName: profile.full_name 
      });
      navigate("/creator-dashboard");
      return;
    }
  }, [step2Complete, navigate, isExistingUser, profile, user]);

  // Handle step navigation based on completion status
  useEffect(() => {
    if (!loading && step1Complete && step === 1) {
      setStep(2);
    }
  }, [step1Complete, loading, step]);

  if (loading || !user) {
    return <OnboardingSkeleton />;
  }

  const handleBackStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkipToDashboard = () => {
    navigate("/creator-dashboard");
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card className="border shadow-md bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl">Welcome to Creator Chapter!</CardTitle>
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>
          <CardDescription className="text-base">
            {step === 1
              ? "Let's set up your basic profile - only username and name are required!"
              : "Add your portfolio (optional) - you can always do this later"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Debug info for development */}
          <OnboardingDebugInfo />

          {/* Progress indicator */}
          <div className="w-full flex items-center mb-6">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <div className="ml-3 text-sm text-gray-600 font-medium">
              {Math.round((step / TOTAL_STEPS) * 100)}%
            </div>
          </div>

          {/* Step content */}
          <div className="mt-4">
            {step === 1 ? (
              <Step1Identity 
                user={user} 
                onNext={() => { setStep(2); refetch(); }} 
                onSkip={handleSkipToDashboard}
              />
            ) : (
              <Step2Portfolio 
                user={user} 
                onDone={handleSkipToDashboard}
                onSkip={handleSkipToDashboard}
              />
            )}
          </div>

          {/* Navigation buttons */}
          {step > 1 && (
            <div className="flex justify-start mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleBackStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
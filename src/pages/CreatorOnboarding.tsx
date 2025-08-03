
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useToast } from "@/hooks/use-toast";
import Step1Identity from "../components/onboarding/Step1Identity";
import Step2Portfolio from "../components/onboarding/Step2Portfolio";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { OnboardingSkeleton } from "@/components/shared/QuickSkeleton";

const TOTAL_STEPS = 2;

export default function CreatorOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const { step1Complete, step2Complete, loading, refetch } = useProfileCompletion();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle automatic navigation if onboarding already completed
  useEffect(() => {
    if (step2Complete) {
      navigate("/creator-dashboard");
    }
  }, [step2Complete, navigate]);

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

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card className="border shadow-md bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>
          <CardDescription>
            {step === 1 
              ? "Let's start with some basic information about you" 
              : "Now tell us about the content you create"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Progress indicator */}
          <div className="w-full flex items-center mb-8">
            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} 
              />
            </div>
            <div className="ml-2 text-xs text-gray-500">
              {Math.round((step / TOTAL_STEPS) * 100)}%
            </div>
          </div>
          
          {/* Step content */}
          <div className="mt-4">
            {step === 1 ? (
              <Step1Identity user={user} onNext={() => { setStep(2); refetch(); }} />
            ) : (
              <Step2Portfolio user={user} onDone={() => { refetch(); }} />
            )}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBackStep}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            ) : (
              <div></div> // Empty div to maintain flex spacing
            )}
            
            {step === 2 && (
              <Button 
                type="button" 
                onClick={() => navigate("/creator-dashboard")}
                variant="outline"
              >
                Skip for now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import Step1Identity from "../components/onboarding/Step1Identity";
import Step2Portfolio from "../components/onboarding/Step2Portfolio";

const TOTAL_STEPS = 2;

export default function CreatorOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const { step1Complete, step2Complete, loading, refetch } = useProfileCompletion();
  const [step, setStep] = useState(1);

  // Automatic advance if step complete
  if (step === 1 && step1Complete) setStep(2);
  if (step === 2 && step2Complete) {
    navigate("/dashboard");
    return null;
  }
  if (loading || !user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white/80 rounded-xl shadow-lg">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between mb-4 items-center">
          <h1 className="text-xl font-bold">
            {step === 1 ? "Basic Info" : "Portfolio & Formats"}
          </h1>
          <span className="text-sm text-gray-500">
            Step {step} / {TOTAL_STEPS}
          </span>
        </div>
        {step === 1 ? (
          <Step1Identity user={user} onNext={() => { setStep(2); refetch(); }} />
        ) : (
          <Step2Portfolio user={user} onDone={() => { refetch(); }} />
        )}
      </div>
    </div>
  );
}

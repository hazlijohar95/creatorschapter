
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CampaignBasicInfo } from "./wizard/CampaignBasicInfo";
import { CampaignRequirements } from "./wizard/CampaignRequirements";
import { CampaignBudget } from "./wizard/CampaignBudget";
import { CampaignReview } from "./wizard/CampaignReview";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CampaignFormData } from "@/types/forms";

interface CampaignWizardProps {
  onComplete: (data: CampaignFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function CampaignWizard({ 
  onComplete, 
  onCancel,
  isSubmitting
}: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic info
    name: "",
    description: "",
    categories: [] as string[],
    start_date: "",
    end_date: "",
    
    // Requirements
    contentRequirements: {
      formats: [] as string[],
      deliverables: [] as string[],
      guidelines: "",
    },
    
    // Budget & audience
    budget: undefined as number | undefined,
    audienceRequirements: {
      minFollowers: 0,
      preferredNiches: [] as string[],
      preferredLocations: [] as string[],
    },
  });

  const steps = [
    { title: "Campaign Details", description: "Basic information about your campaign" },
    { title: "Content Requirements", description: "What you need from creators" },
    { title: "Budget & Audience", description: "Target budget and creator requirements" },
    { title: "Review", description: "Review and finalize your campaign" }
  ];
  
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Convert to the format expected by the createCampaign function
    const campaignData = {
      name: formData.name,
      description: formData.description,
      categories: formData.categories,
      start_date: formData.start_date,
      end_date: formData.end_date,
      budget: formData.budget,
      status: "draft",
      contentRequirements: formData.contentRequirements,
      audienceRequirements: formData.audienceRequirements
    };
    
    onComplete(campaignData);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  // Track slide direction for animations
  const [slideDirection, setSlideDirection] = useState(0);

  const nextWithAnimation = () => {
    setSlideDirection(1);
    handleNext();
  };

  const backWithAnimation = () => {
    setSlideDirection(-1);
    handleBack();
  };

  const renderStepContent = () => {
    return (
      <AnimatePresence mode="wait" custom={slideDirection}>
        <motion.div
          key={currentStep}
          custom={slideDirection}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="w-full overflow-hidden"
        >
          {currentStep === 0 && (
            <CampaignBasicInfo 
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 1 && (
            <CampaignRequirements
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 2 && (
            <CampaignBudget
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 3 && (
            <CampaignReview
              formData={formData}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  const isFormValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim().length > 0;
      default:
        return true;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <CardDescription>{steps[currentStep].description}</CardDescription>
        <Progress value={progress} className="h-1 mt-4" />
      </CardHeader>
      <CardContent className="py-4 min-h-[450px]">
        {renderStepContent()}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : backWithAnimation}
        >
          {currentStep === 0 ? "Cancel" : (
            <>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </>
          )}
        </Button>
        <Button
          onClick={currentStep === steps.length - 1 ? handleSubmit : nextWithAnimation}
          disabled={(isSubmitting && currentStep === steps.length - 1) || !isFormValid()}
        >
          {currentStep === steps.length - 1 ? (
            isSubmitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" /> Creating Campaign...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" /> Create Campaign
              </>
            )
          ) : (
            <>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

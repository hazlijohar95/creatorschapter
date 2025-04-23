
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Info, MessageSquare, Calendar, DollarSign, CheckCircle } from "lucide-react";
import { Opportunity } from "../types/opportunity";
import { useState } from "react";
import { toast } from "sonner";

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (opportunityId: string, message: string) => void;
}

export function OpportunityDetailModal({
  opportunity,
  isOpen,
  onClose,
  onApply,
}: OpportunityDetailModalProps) {
  const [applicationMessage, setApplicationMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!opportunity) return null;

  const handleApply = async () => {
    if (!applicationMessage.trim()) {
      toast.error("Please include a message with your application");
      return;
    }

    setIsSubmitting(true);
    try {
      await onApply(opportunity.id, applicationMessage);
      toast.success("Application submitted successfully!");
      setApplicationMessage("");
      onClose();
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      console.error("Application submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Color-coding for match progress
  let matchColor = "bg-orange-500";
  if (opportunity.match >= 90) matchColor = "bg-green-500";
  else if (opportunity.match >= 80) matchColor = "bg-blue-500";
  else if (opportunity.match >= 70) matchColor = "bg-yellow-500";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-space">{opportunity.title}</DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>{opportunity.company}</span>
            <span className="font-medium text-primary">{opportunity.budget}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apply">Apply Now</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="py-4 space-y-6">
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" /> About this opportunity
                </h3>
                <p className="text-gray-700">{opportunity.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/40 rounded-lg p-4 space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Deadline
                  </h4>
                  <p className="font-medium">{opportunity.deadline}</p>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-4 space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Budget
                  </h4>
                  <p className="font-medium">{opportunity.budget}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" /> Required Deliverables
                </h4>
                <ul className="list-disc list-inside space-y-1 pl-2 text-gray-700">
                  <li>3-5 Instagram stories featuring the product</li>
                  <li>1 in-feed post with product placement</li>
                  <li>Detailed review with personal experience</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Match Score</h4>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{opportunity.match}%</span>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${matchColor}`} style={{ width: `${opportunity.match}%` }} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  This opportunity matches your profile and content style.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="apply" className="py-4 space-y-6">
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-lg p-4 space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" /> Your Application Message
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Introduce yourself and explain why you're interested in this opportunity.
                </p>
                <Textarea
                  placeholder="I'm excited about this opportunity because..."
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="bg-muted/40 rounded-lg p-4 space-y-2">
                <h4 className="font-medium">What happens next?</h4>
                <ol className="list-decimal list-inside space-y-1 pl-2 text-gray-700">
                  <li>Your application will be reviewed by the brand</li>
                  <li>If interested, the brand will reach out to discuss details</li>
                  <li>You'll finalize the agreement and start the collaboration</li>
                </ol>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          {activeTab === "overview" ? (
            <Button onClick={() => setActiveTab("apply")}>Apply Now</Button>
          ) : (
            <Button onClick={handleApply} disabled={isSubmitting || !applicationMessage.trim()}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

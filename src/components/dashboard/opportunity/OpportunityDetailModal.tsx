
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
import { 
  Info, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Users, 
  Clock, 
  AlertTriangle,
  Star,
  CheckCheck
} from "lucide-react";
import { Opportunity } from "../types/opportunity";
import { useState } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

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
  let matchTextColor = "text-orange-600";
  let matchBgColor = "bg-orange-50";
  let matchBorderColor = "border-orange-100";
  
  if (opportunity.match >= 90) {
    matchColor = "bg-green-500";
    matchTextColor = "text-green-600";
    matchBgColor = "bg-green-50";
    matchBorderColor = "border-green-100";
  } else if (opportunity.match >= 80) {
    matchColor = "bg-blue-500";
    matchTextColor = "text-blue-600";
    matchBgColor = "bg-blue-50";
    matchBorderColor = "border-blue-100";
  } else if (opportunity.match >= 70) {
    matchColor = "bg-yellow-500";
    matchTextColor = "text-yellow-600";
    matchBgColor = "bg-yellow-50";
    matchBorderColor = "border-yellow-100";
  }

  // Calculate days until deadline
  const daysUntil = () => {
    const now = new Date();
    const deadline = new Date(opportunity.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const days = daysUntil();
  const isUrgent = days <= 3 && days > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DialogTitle className="text-xl font-space">{opportunity.title}</DialogTitle>
            {opportunity.isNew && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                New Opportunity
              </Badge>
            )}
          </div>
          <DialogDescription className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {opportunity.company}
            </span>
            <span className="font-medium text-primary">{opportunity.budget}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 mt-2">
          {opportunity.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-secondary/60 border-0 px-3 py-1 text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className={`flex items-center gap-2 p-3 rounded-md ${matchBgColor} ${matchBorderColor} border mt-2`}>
          <Star className={`h-5 w-5 ${matchTextColor}`} />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className={`font-medium ${matchTextColor}`}>Match Score: {opportunity.match}%</span>
              <span className="text-xs text-muted-foreground">Based on your profile and content</span>
            </div>
            <Progress value={opportunity.match} className="h-1.5" />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apply">Apply Now</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="py-4 space-y-6 animate-fade-in">
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
                  <p className="font-medium flex items-center gap-1.5">
                    {isUrgent && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    {opportunity.deadline} {isUrgent && <span className="text-sm text-red-500 font-normal">(Urgent)</span>}
                  </p>
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
                  <li>Usage rights for brand to reshare content</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Timeline
                </h4>
                <ul className="list-none space-y-3 pl-2">
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</div>
                    <div className="flex-1">
                      <div className="font-medium">Application Review</div>
                      <div className="text-sm text-muted-foreground">Within 3 business days</div>
                    </div>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</div>
                    <div className="flex-1">
                      <div className="font-medium">Content Creation</div>
                      <div className="text-sm text-muted-foreground">1-2 weeks (if selected)</div>
                    </div>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">3</div>
                    <div className="flex-1">
                      <div className="font-medium">Posting Period</div>
                      <div className="text-sm text-muted-foreground">According to campaign schedule</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="apply" className="py-4 space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-lg p-4 space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" /> Your Application Message
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Introduce yourself and explain why you're interested in this opportunity. Be specific about how your content aligns with this brand.
                </p>
                <Textarea
                  placeholder="I'm excited about this opportunity because..."
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  className="min-h-[150px]"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    Characters: {applicationMessage.length}
                  </span>
                  {applicationMessage.length < 100 && (
                    <span className="text-amber-500">
                      We recommend at least 100 characters for best results
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-muted/40 rounded-lg p-4 space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCheck className="h-4 w-4 text-primary" /> Application Checklist
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs 
                      ${applicationMessage.trim() ? "bg-green-500 text-white" : "bg-muted border"}`}>
                      {applicationMessage.trim() && "✓"}
                    </div>
                    <div className="flex-1">
                      <div className={applicationMessage.trim() ? "font-medium" : "text-muted-foreground"}>
                        Write an application message
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs 
                      ${applicationMessage.length >= 100 ? "bg-green-500 text-white" : "bg-muted border"}`}>
                      {applicationMessage.length >= 100 && "✓"}
                    </div>
                    <div className="flex-1">
                      <div className={applicationMessage.length >= 100 ? "font-medium" : "text-muted-foreground"}>
                        Include details about your relevant experience
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs 
                      ${applicationMessage.trim() ? "bg-green-500 text-white" : "bg-muted border"}`}>
                      {applicationMessage.trim() && "✓"}
                    </div>
                    <div className="flex-1">
                      <div className={applicationMessage.trim() ? "font-medium" : "text-muted-foreground"}>
                        Mention any relevant past work
                      </div>
                    </div>
                  </li>
                </ul>
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
            <Button 
              onClick={handleApply} 
              disabled={isSubmitting || !applicationMessage.trim()}
              className={`${applicationMessage.trim() ? "animate-pulse" : ""}`}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

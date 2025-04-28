
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle, AlertCircle } from "lucide-react";

interface CampaignReviewProps {
  formData: any;
}

export function CampaignReview({ formData }: CampaignReviewProps) {
  const hasRequiredFields = () => {
    return formData.name && formData.description;
  };

  const hasDates = () => {
    return formData.start_date && formData.end_date;
  };

  const hasContentFormats = () => {
    return formData.contentRequirements.formats.length > 0;
  };

  const hasBudget = () => {
    return formData.budget && formData.budget > 0;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Alert variant={hasRequiredFields() ? "default" : "destructive"} className="border-2">
        {hasRequiredFields() ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <AlertTitle>Campaign Validation</AlertTitle>
        <AlertDescription>
          {hasRequiredFields() 
            ? "Your campaign is ready to be published." 
            : "Please fill in all required fields before publishing."}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="font-medium">Campaign Name</div>
              <div>{formData.name || "Not specified"}</div>
            </div>
            
            <div>
              <div className="font-medium">Description</div>
              <div className="line-clamp-3">{formData.description || "Not specified"}</div>
            </div>
            
            <div>
              <div className="font-medium">Duration</div>
              {hasDates() ? (
                <div>
                  {format(new Date(formData.start_date), "MMM dd, yyyy")} - {format(new Date(formData.end_date), "MMM dd, yyyy")}
                </div>
              ) : (
                <div className="text-muted-foreground italic">Dates not specified</div>
              )}
            </div>
            
            <div>
              <div className="font-medium">Categories</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.categories.length > 0 ? (
                  formData.categories.map((category: string, index: number) => (
                    <Badge key={index} variant="outline">{category}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground italic">None specified</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Budget & Audience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="font-medium">Budget</div>
              <div className="text-lg">{hasBudget() ? `$${formData.budget}` : "Not specified"}</div>
            </div>

            <div>
              <div className="font-medium">Minimum Followers</div>
              <div>
                {formData.audienceRequirements.minFollowers > 0 ? (
                  `${formData.audienceRequirements.minFollowers >= 1000000 
                    ? (formData.audienceRequirements.minFollowers / 1000000).toFixed(1) + 'M' 
                    : (formData.audienceRequirements.minFollowers / 1000).toFixed(0) + 'K'}`
                ) : (
                  "No minimum"
                )}
              </div>
            </div>
            
            <div>
              <div className="font-medium">Preferred Niches</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.audienceRequirements.preferredNiches.length > 0 ? (
                  formData.audienceRequirements.preferredNiches.map((niche: string, index: number) => (
                    <Badge key={index} variant="outline">{niche}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground italic">None specified</span>
                )}
              </div>
            </div>
            
            <div>
              <div className="font-medium">Preferred Locations</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.audienceRequirements.preferredLocations.length > 0 ? (
                  formData.audienceRequirements.preferredLocations.map((location: string, index: number) => (
                    <Badge key={index} variant="outline">{location}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground italic">None specified</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <div className="font-medium">Content Formats</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {hasContentFormats() ? (
                formData.contentRequirements.formats.map((format: string, index: number) => (
                  <Badge key={index} variant="secondary">{format}</Badge>
                ))
              ) : (
                <span className="text-muted-foreground italic">None specified</span>
              )}
            </div>
          </div>
          
          <div>
            <div className="font-medium">Deliverables</div>
            {formData.contentRequirements.deliverables.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 mt-1">
                {formData.contentRequirements.deliverables.map((deliverable: string, index: number) => (
                  <li key={index}>{deliverable}</li>
                ))}
              </ul>
            ) : (
              <div className="text-muted-foreground italic">None specified</div>
            )}
          </div>
          
          <div>
            <div className="font-medium">Content Guidelines</div>
            {formData.contentRequirements.guidelines ? (
              <div className="mt-1 whitespace-pre-line">
                {formData.contentRequirements.guidelines}
              </div>
            ) : (
              <div className="text-muted-foreground italic">None specified</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

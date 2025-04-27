
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, FileChartColumn } from "lucide-react";
import { format } from "date-fns";

interface Campaign {
  id: string;
  name: string;
  status: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  categories?: string[];
  description?: string;
  progress?: number;
  metrics?: {
    impressions: number;
    engagements: number;
    roi: number;
  };
}

interface CampaignListProps {
  campaigns: Campaign[];
  searchQuery: string;
}

export function CampaignList({ campaigns, searchQuery }: CampaignListProps) {
  // Filter campaigns by search query
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredCampaigns.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8 italic border rounded-lg p-6">
        {searchQuery ? (
          <>No campaigns found matching "{searchQuery}"</>
        ) : (
          <>No campaigns found.</>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredCampaigns.map(campaign => (
        <Link 
          to={`/brand-dashboard/campaigns/${campaign.id}`} 
          key={campaign.id}
          className="block transition-all hover:scale-[1.01]"
        >
          <CampaignCard campaign={campaign} />
        </Link>
      ))}
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const progress = campaign.progress || 
    (campaign.status === "completed" ? 100 : 
    campaign.status === "active" ? 66 : 
    campaign.status === "planning" ? 25 : 10);

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg leading-tight">{campaign.name}</CardTitle>
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaign.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {campaign.description}
            </p>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>
                {campaign.start_date ? format(new Date(campaign.start_date), "MMM d") : "TBD"} 
                {" - "}
                {campaign.end_date ? format(new Date(campaign.end_date), "MMM d, yyyy") : "TBD"}
              </span>
            </div>

            {campaign.budget && (
              <div className="flex items-center gap-2 text-sm">
                <FileChartColumn className="h-4 w-4 text-muted-foreground" />
                <span>Budget: ${campaign.budget.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {campaign.metrics && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              <div className="text-center">
                <div className="text-sm font-medium">{campaign.metrics.impressions}</div>
                <div className="text-xs text-muted-foreground">Impressions</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{campaign.metrics.engagements}</div>
                <div className="text-xs text-muted-foreground">Engagements</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{campaign.metrics.roi}%</div>
                <div className="text-xs text-muted-foreground">ROI</div>
              </div>
            </div>
          )}

          {campaign.categories && campaign.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {campaign.categories.map(category => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

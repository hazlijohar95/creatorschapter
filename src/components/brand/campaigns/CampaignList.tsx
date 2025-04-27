
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface Campaign {
  id: string;
  name: string;
  status: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  categories?: string[];
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
    <div className="grid gap-4">
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const progress = campaign.status === "completed" ? 100 : 
                   campaign.status === "active" ? 66 : 
                   campaign.status === "planning" ? 25 : 10;
  
  const startDate = campaign.start_date ? format(new Date(campaign.start_date), "MMM d, yyyy") : "-";
  const endDate = campaign.end_date ? format(new Date(campaign.end_date), "MMM d, yyyy") : "-";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{campaign.name}</CardTitle>
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Timeline:</span>
              <span>{startDate} - {endDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Budget:</span>
              <span>{typeof campaign.budget === "number" ? `$${campaign.budget.toLocaleString()}` : "-"}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </div>
          <div>
            <div className="text-sm mb-2">
              <span className="text-muted-foreground">Categories:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {campaign.categories?.length ? (
                  campaign.categories.map(category => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground italic text-xs">No categories</span>
                )}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">Creators:</span>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">+</AvatarFallback>
                </Avatar>
                <span className="text-sm">Add creators</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

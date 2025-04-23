
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Check } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { hasAppliedToCampaign } from "@/services/campaignService";
import { Campaign, ApplicationStatus } from "./types";

interface CampaignCardProps {
  campaign: Campaign;
  matchScore: number;
  onViewDetails: () => void;
  onApply: () => void;
}

export function CampaignCard({ campaign, matchScore, onViewDetails, onApply }: CampaignCardProps) {
  const { user } = useAuthStore();
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>({ hasApplied: false, status: null });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const fetchApplicationStatus = async () => {
      setChecking(true);
      try {
        const status = await hasAppliedToCampaign(campaign.id, user.id);
        if (isMounted) setApplicationStatus(status);
      } finally {
        if (isMounted) setChecking(false);
      }
    };
    fetchApplicationStatus();
    return () => { isMounted = false; }
  }, [campaign.id, user]);

  const getStatusBadge = () => {
    if (checking) return null;
    if (applicationStatus.hasApplied) {
      switch (applicationStatus.status) {
        case "pending":
          return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>;
        case "approved":
          return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Approved</span>;
        case "rejected":
          return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Rejected</span>;
        default:
          return null;
      }
    }
    return campaign.end_date && new Date(campaign.end_date) < new Date()
      ? <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Expired</span>
      : <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">New</span>;
  };

  return (
    <Card key={campaign.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{campaign.name}</CardTitle>
            <CardDescription className="pt-1">{campaign.profiles.full_name} • ${campaign.budget}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {campaign.categories?.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3">{campaign.description}</p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Match score</span>
            <span className="font-medium">{matchScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
                matchScore >= 90 ? "bg-green-500"
                  : matchScore >= 80 ? "bg-blue-500"
                  : matchScore >= 70 ? "bg-yellow-500"
                  : "bg-orange-500"
              }`}
              style={{ width: `${matchScore}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 pt-3 flex justify-between">
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          <BookOpen className="mr-2 h-4 w-4" />View Details
        </Button>
        {checking ? (
          <Button size="sm" disabled>Loading...</Button>
        ) : applicationStatus.hasApplied ? (
          <Button size="sm" variant="secondary" disabled>
            <Check className="mr-2 h-4 w-4" />
            Applied
          </Button>
        ) : (
          <Button size="sm" onClick={onApply}>Apply Now</Button>
        )}
      </CardFooter>
    </Card>
  );
}

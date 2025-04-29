
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Application as DashboardApplication } from "@/components/dashboard/types/opportunity";

interface ApplicationsManagementProps {
  applications: DashboardApplication[];
  onViewDetails: (applicationId: string) => void;
  onMessageBrand: (applicationId: string) => void;
}

export function ApplicationsManagement({
  applications,
  onViewDetails,
  onMessageBrand,
}: ApplicationsManagementProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredApplications = (tab: string) =>
    tab === "all"
      ? applications
      : applications.filter((app) => app.status === tab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold font-space">My Applications</h2>
        <Badge variant="outline" className="font-medium">
          {applications.length} Total
        </Badge>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="in_discussion">In Discussion</TabsTrigger>
          <TabsTrigger value="rejected">Not Selected</TabsTrigger>
        </TabsList>

        {["all", "pending", "approved", "in_discussion", "rejected"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="grid gap-4">
              {filteredApplications(tab).length > 0 ? (
                filteredApplications(tab).map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onViewDetails={onViewDetails}
                    onMessageBrand={onMessageBrand}
                  />
                ))
              ) : (
                <div className="text-center py-10 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">
                    No {tab !== "all" ? tab : ""} applications found
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface ApplicationCardProps {
  application: DashboardApplication;
  onViewDetails: (applicationId: string) => void;
  onMessageBrand: (applicationId: string) => void;
}

function ApplicationCard({
  application,
  onViewDetails,
  onMessageBrand,
}: ApplicationCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-space">
              {application.opportunity.title}
            </CardTitle>
            <CardDescription>
              {application.opportunity.company}
            </CardDescription>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Applied: {application.appliedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Updated: {application.lastUpdateDate}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {application.message}
        </p>
      </CardContent>
      <CardFooter className="border-t bg-muted/40 pt-3">
        <div className="flex items-center justify-between w-full">
          <Badge variant="outline" className="font-medium">
            {application.opportunity.budget}
          </Badge>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-primary/20"
              onClick={() => onMessageBrand(application.id)}
            >
              <MessageSquare className="mr-1 h-4 w-4" />
              Message
            </Button>
            <Button
              size="sm"
              onClick={() => onViewDetails(application.id)}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

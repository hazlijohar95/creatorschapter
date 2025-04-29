
import { useState } from "react";
import { Application } from "../../types/opportunity";
import { ApplicationsManagement } from "@/domains/applications/components/ApplicationsManagement";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface ApplicationsContentProps {
  applications: Application[];
  onViewApplication: (id: string) => void;
  onMessageBrand: (id: string) => void;
}

export function ApplicationsContent({
  applications,
  onViewApplication,
  onMessageBrand,
}: ApplicationsContentProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const filteredApplications = statusFilter === "all" 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  return (
    <div className="space-y-4">
      <Card className="p-4 shadow-sm backdrop-blur-sm bg-gradient-to-br from-card to-card/90 border-muted/20">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">
            {statusFilter === "all" ? "All applications" : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} applications`}
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {filteredApplications.length} total
            </span>
          </h3>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-muted/20 bg-card hover:border-primary/40 transition-colors">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="in_discussion">In Discussion</SelectItem>
              <SelectItem value="rejected">Not Selected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
      
      <ApplicationsManagement
        applications={filteredApplications}
        onViewDetails={onViewApplication}
        onMessageBrand={onMessageBrand}
      />
    </div>
  );
}

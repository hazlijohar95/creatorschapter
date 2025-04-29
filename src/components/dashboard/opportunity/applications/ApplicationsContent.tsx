
import { useState } from "react";
import { Application } from "../../types/opportunity";
import { ApplicationsManagement } from "@/domains/applications/components/ApplicationsManagement";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {statusFilter === "all" ? "All applications" : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} applications`}
        </h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
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
      
      <ApplicationsManagement
        applications={filteredApplications}
        onViewDetails={onViewApplication}
        onMessageBrand={onMessageBrand}
      />
    </div>
  );
}

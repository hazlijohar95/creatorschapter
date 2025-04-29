
import { useState } from "react";
import { Application } from "../../types/opportunity";
import { ApplicationsManagement } from "@/domains/applications/components/ApplicationsManagement";
import { ApplicationsFilter } from "./ApplicationsFilter";

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
      <ApplicationsFilter 
        count={filteredApplications.length} 
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />
      
      <ApplicationsManagement
        applications={filteredApplications}
        onViewDetails={onViewApplication}
        onMessageBrand={onMessageBrand}
      />
    </div>
  );
}

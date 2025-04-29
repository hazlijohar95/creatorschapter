
import { Application } from "../../types/opportunity";
import { ApplicationsManagement } from "@/domains/applications/components/ApplicationsManagement";

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
  return (
    <div className="space-y-4">
      <ApplicationsManagement
        applications={applications}
        onViewDetails={onViewApplication}
        onMessageBrand={onMessageBrand}
      />
    </div>
  );
}

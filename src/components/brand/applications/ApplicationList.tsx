
import { Application } from "./types";
import { ApplicationCard } from "../ApplicationCard";
import { ApplicationEmptyState } from "./ApplicationEmptyState";

interface ApplicationListProps {
  applications: Application[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDiscuss: (id: number) => void;
  onViewProfile: (application: Application) => void;
  selectedApplications: number[];
  onToggleSelection: (id: number) => void;
}

export function ApplicationList({
  applications,
  onApprove,
  onReject,
  onDiscuss,
  onViewProfile,
  selectedApplications,
  onToggleSelection,
}: ApplicationListProps) {
  if (applications.length === 0) {
    return <ApplicationEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onApprove={onApprove}
          onReject={onReject}
          onDiscuss={onDiscuss}
          onViewProfile={() => onViewProfile(application)}
          isSelected={selectedApplications.includes(application.id)}
          onToggleSelection={() => onToggleSelection(application.id)}
        />
      ))}
    </div>
  );
}

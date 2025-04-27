
import { ApplicationCard } from "../ApplicationCard";
import { Application } from "../../../types/applications";

interface ApplicationsGridProps {
  applications: Application[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDiscuss: (id: string) => void;
  onViewProfile: (application: Application) => void;
  selectedApplications: string[];
  onToggleSelection: (id: string) => void;
}

export function ApplicationsGrid({
  applications,
  onApprove,
  onReject,
  onDiscuss,
  onViewProfile,
  selectedApplications,
  onToggleSelection,
}: ApplicationsGridProps) {
  if (applications.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center py-16 animate-fade-in">
        <span className="text-5xl mb-2">🕵️‍♂️</span>
        <h2 className="text-lg font-semibold mb-1">No applications found</h2>
        <p className="text-muted-foreground mb-2">Try another tab or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map(application => (
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

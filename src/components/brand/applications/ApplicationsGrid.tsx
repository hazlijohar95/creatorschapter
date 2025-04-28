
import { ApplicationCard } from "../ApplicationCard";
import { Application } from "../../../types/applications";
import { VirtualizedList } from "@/components/shared/VirtualizedList";

interface ApplicationsGridProps {
  applications: Application[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDiscuss: (id: string) => void;
  onViewProfile: (application: Application) => void;
  selectedApplications: string[];
  onToggleSelection: (id: string) => void;
  useVirtualization?: boolean;
}

export function ApplicationsGrid({
  applications,
  onApprove,
  onReject,
  onDiscuss,
  onViewProfile,
  selectedApplications,
  onToggleSelection,
  useVirtualization = true,
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

  // Calculate estimated item height for virtualization (adjust based on your card's actual size)
  const estimatedItemHeight = 400; 
  
  const renderApplicationCard = (application: Application, index: number) => (
    <div className="p-3" key={application.id}>
      <ApplicationCard
        application={application}
        onApprove={onApprove}
        onReject={onReject}
        onDiscuss={onDiscuss}
        onViewProfile={() => onViewProfile(application)}
        isSelected={selectedApplications.includes(application.id)}
        onToggleSelection={() => onToggleSelection(application.id)}
      />
    </div>
  );

  // Use virtualization for large lists
  if (useVirtualization && applications.length > 20) {
    // For three columns on large screens, one column on mobile
    return (
      <div className="w-full">
        <VirtualizedList
          items={applications}
          height={700} // Adjust based on your layout
          itemSize={estimatedItemHeight}
          renderItem={renderApplicationCard}
          itemKey={(index, data) => data[index].id}
        />
      </div>
    );
  }
  
  // Standard grid for smaller lists
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

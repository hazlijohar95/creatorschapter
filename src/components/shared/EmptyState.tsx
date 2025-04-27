
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  secondaryAction,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center py-16 text-center px-4 animate-fade-in ${className}`}>
      {typeof icon === "string" ? (
        <span className="text-5xl mb-4">{icon}</span>
      ) : icon ? (
        <div className="mb-4">{icon}</div>
      ) : null}
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <div className="flex gap-3">
        {action && (
          <Button onClick={action.onClick} className="min-w-32">
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick} className="min-w-32">
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

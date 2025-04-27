
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`col-span-full flex flex-col items-center py-16 animate-fade-in ${className}`}>
      {icon && <span className="text-5xl mb-2">{icon}</span>}
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      {description && (
        <p className="text-muted-foreground mb-2">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

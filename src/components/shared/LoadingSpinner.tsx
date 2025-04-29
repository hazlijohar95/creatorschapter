
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  variant?: "inline" | "overlay" | "centered";
}

export function LoadingSpinner({ 
  size = "md", 
  className = "", 
  text, 
  variant = "centered"
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  const variantClasses = {
    inline: "inline-flex items-center",
    overlay: "absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10",
    centered: "flex flex-col items-center justify-center"
  };

  return (
    <div className={cn(variantClasses[variant], className)}>
      <Loader className={cn(`animate-spin text-primary ${sizeClasses[size]}`)} />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}

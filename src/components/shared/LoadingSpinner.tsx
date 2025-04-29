
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  text?: string;
  variant?: "inline" | "overlay" | "centered" | "minimal";
}

export function LoadingSpinner({ 
  size = "md", 
  className = "", 
  text, 
  variant = "centered"
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const variantClasses = {
    inline: "inline-flex items-center",
    overlay: "absolute inset-0 bg-background/30 backdrop-blur-[1px] z-10 flex items-center justify-center",
    centered: "flex flex-col items-center justify-center",
    minimal: "inline-flex items-center opacity-70"
  };

  return (
    <div className={cn(variantClasses[variant], className)}>
      <Loader className={cn(`animate-spin text-primary ${sizeClasses[size]}`)} />
      {text && variant !== "minimal" && (
        <p className={cn("text-sm text-muted-foreground", variant === "inline" ? "ml-2" : "mt-2")}>
          {text}
        </p>
      )}
    </div>
  );
}

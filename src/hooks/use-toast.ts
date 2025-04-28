
import { toast as sonnerToast, type ToastT } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  // Add the variant property to fix TypeScript errors
  type?: "default" | "success" | "error" | "warning" | "info";
  variant?: "default" | "destructive"; // For backward compatibility
};

export function useToast() {
  const toast = (props: ToastProps) => {
    const { title, description, action, type = "default", variant } = props;
    
    // Support both type and variant (backward compatibility)
    const actualType = variant === "destructive" ? "error" : type;
    
    if (actualType === "error") {
      sonnerToast.error(title, {
        description,
        action
      });
    } else if (actualType === "success") {
      sonnerToast.success(title, {
        description,
        action
      });
    } else if (actualType === "warning") {
      sonnerToast.warning(title, {
        description,
        action
      });
    } else if (actualType === "info") {
      sonnerToast.info(title, {
        description,
        action
      });
    } else {
      sonnerToast(title, {
        description,
        action
      });
    }
  };

  return { toast };
}

// Re-export the sonner toast for direct usage
export { toast } from "sonner";

// Add these helpers for easier type checking in components that use direct toast calls
export const toastTypes = {
  default: "default",
  success: "success",
  error: "error",
  warning: "warning",
  info: "info"
} as const;

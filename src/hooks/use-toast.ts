
import { toast as sonnerToast } from "@/components/ui/sonner";

export type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

export function useToast() {
  const toast = ({ title, description, variant = "default", ...props }: ToastOptions) => {
    sonnerToast[variant === "destructive" ? "error" : "default"](title, {
      description,
      ...props,
    });
  };

  return { toast };
}

// Re-export the sonner toast for direct usage
export { toast } from "@/components/ui/sonner";

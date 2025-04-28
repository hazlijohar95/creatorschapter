
import { toast as sonnerToast, type ToastT } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  type?: "default" | "success" | "error" | "warning" | "info";
};

export function useToast() {
  const toast = (props: ToastProps) => {
    const { title, description, action, type = "default" } = props;
    
    if (type === "error") {
      sonnerToast.error(title, {
        description,
        action
      });
    } else if (type === "success") {
      sonnerToast.success(title, {
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

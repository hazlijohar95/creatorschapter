
import { toast as sonnerToast, type ToastOptions as SonnerToastOptions } from "@/components/ui/sonner";

interface ToastOptions extends SonnerToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}

export function useToast() {
  const toast = ({ title, description, variant = "default", ...props }: ToastOptions) => {
    sonnerToast[variant === "destructive" ? "error" : "default"](title, {
      description,
      ...props,
    });
  };

  return { toast };
}

export { toast } from "../components/ui/use-toast";

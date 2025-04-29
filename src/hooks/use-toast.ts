
import {
  toast as sonnerToast,
  type Toast as ToastT,
} from 'sonner';

// Define our own ToastOptions type since it's not exported from sonner
interface SonnerToastOptions {
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  id?: string | number;
  duration?: number;
  dismissible?: boolean;
  onDismiss?: (toast: ToastT) => void;
  onAutoClose?: (toast: ToastT) => void;
  className?: string;
  style?: React.CSSProperties;
  unstyled?: boolean;
}

// Extend the SonnerToastOptions type to include both variant and type for backward compatibility
export interface ToastProps extends SonnerToastOptions {
  title?: string;
  variant?: "default" | "destructive" | "success" | "warning" | "info"; // For backward compatibility
  type?: "default" | "destructive" | "success" | "warning" | "info";
}

export interface IToast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export type ToasterToast = ToastT & ToastProps;

const useToast = () => {
  return {
    toast: (props: ToastProps) => {
      const { title, description, variant, type, ...rest } = props;
      // Use type prop if available, fall back to variant, or default if neither is provided
      const toastType = type || variant || "default";
      
      // Map to Sonner's toast methods based on type
      switch (toastType) {
        case "destructive":
          return sonnerToast.error(title, {
            description,
            ...rest,
          });
        case "success":
          return sonnerToast.success(title, {
            description,
            ...rest,
          });
        case "warning":
          return sonnerToast.warning(title, {
            description,
            ...rest,
          });
        case "info":
          return sonnerToast.info(title, {
            description,
            ...rest,
          });
        default:
          return sonnerToast(title, {
            description,
            ...rest,
          });
      }
    },
    toasts: [], // This is needed for compatibility with shadcn/ui toast component
    dismiss: sonnerToast.dismiss,
  };
};

// For direct usage
const toast = (props: ToastProps) => {
  const { toast: toastFn } = useToast();
  return toastFn(props);
};

export { useToast, toast };

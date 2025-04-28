
import { Loader } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center gap-2">
        <Loader className="animate-spin text-primary h-5 w-5" />
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Loading...</span>
      </div>
    </div>
  );
}

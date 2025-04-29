
import { Loader } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
        <Loader className="animate-spin text-primary h-5 w-5" />
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Loading app...</span>
      </div>
    </div>
  );
}

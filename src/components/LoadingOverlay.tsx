
import { Loader } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-[1px] animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-200">
        <Loader className="animate-spin text-primary h-4 w-4" />
        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">Loading...</span>
      </div>
    </div>
  );
}

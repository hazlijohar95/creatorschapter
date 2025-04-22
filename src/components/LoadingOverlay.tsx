
import { Loader } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Loader className="animate-spin mb-2 text-primary" size={36} />
        <span className="text-base font-medium text-gray-800">Loading...</span>
      </div>
    </div>
  );
}

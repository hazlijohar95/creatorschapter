
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

// Lazy-load the settings panel component
// We need to transform the named export to a default export for lazy loading
const BrandSettingsPanel = lazy(() => import("./settings/BrandSettingsPanel").then(module => ({ 
  default: module.BrandSettingsPanel 
})));

export function BrandSettings() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[70vh]">
      <LoadingSpinner size="lg" />
    </div>}>
      <BrandSettingsPanel />
    </Suspense>
  );
}

export default BrandSettings;

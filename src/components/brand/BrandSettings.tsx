
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

// Lazy-load the settings panel component
// The error occurs because we're trying to access the default property, but the component is exported as a named export
const BrandSettingsPanel = lazy(() => import("./settings/BrandSettingsPanel"));

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

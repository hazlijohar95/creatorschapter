
import { SidebarHeader as UISidebarHeader } from "@/components/ui/sidebar";

export function SidebarHeader() {
  return (
    <UISidebarHeader className="border-b">
      <div className="p-4">
        <h2 className="font-space text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-gray-50">
          Brand Dashboard
        </h2>
      </div>
    </UISidebarHeader>
  );
}

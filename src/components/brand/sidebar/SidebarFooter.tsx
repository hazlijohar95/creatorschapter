
import { SidebarFooter as UISidebarFooter } from "@/components/ui/sidebar";
import { User } from "@supabase/supabase-js";

interface SidebarFooterProps {
  user: User | null;
}

export function SidebarFooter({ user }: SidebarFooterProps) {
  return (
    <UISidebarFooter className="border-t p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <p className="font-medium">{user?.email}</p>
          <p className="text-xs text-muted-foreground">Brand Account</p>
        </div>
      </div>
    </UISidebarFooter>
  );
}

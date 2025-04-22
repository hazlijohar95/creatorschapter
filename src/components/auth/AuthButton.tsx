
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export function AuthButton() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (user) {
    return (
      <Button variant="outline" onClick={handleSignOut}>
        Sign Out
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={() => navigate("/auth")}>
      Sign In
    </Button>
  );
}

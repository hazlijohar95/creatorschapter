
import { useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

interface AuthHeaderProps {
  isSignUp: boolean;
}

export default function AuthHeader({ isSignUp }: AuthHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between pb-5 px-1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              onClick={e => {
                e.preventDefault();
                navigate("/");
              }}
              className="text-muted-foreground hover:text-primary font-medium font-space transition-colors"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-primary font-bold font-space tracking-wide">
              {isSignUp ? "Sign Up" : "Sign In"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/")}
        className="ml-3 px-3 py-1 rounded-lg font-inter border-2 hover:shadow-md hover:border-primary transition text-gray-950"
      >
        Back to Home
      </Button>
    </div>
  );
}

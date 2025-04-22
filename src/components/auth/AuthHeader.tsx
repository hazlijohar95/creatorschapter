
import { useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

interface AuthHeaderProps {
  isSignUp: boolean;
}

export default function AuthHeader({ isSignUp }: AuthHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-row items-center justify-between px-0 sm:px-1 pt-7 pb-1 md:pt-8 md:pb-2">
      <div className="flex-1 flex">
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
      </div>
      <div className="flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="ml-3 px-4 py-1.5 rounded-full font-inter border-2 border-border hover:shadow-lg hover:border-primary transition text-gray-950 bg-white bg-opacity-70 backdrop-blur-md font-semibold"
          style={{ boxShadow: "0 2px 12px 0 rgba(154,129,245,0.10)" }}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Eye, EyeOff } from "lucide-react";
import { validatePasswordStrength } from "@/lib/passwordStrength";

export default function Auth() {
  const navigate = useNavigate();

  // Remember last state: sign in vs sign up
  const lastIsSignUp = (() => {
    try {
      return sessionStorage.getItem("isSignUp") === "true";
    } catch { return true; }
  })();

  const [isSignUp, setIsSignUp] = useState(lastIsSignUp);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"creator" | "brand">("creator");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrengthMsg, setPasswordStrengthMsg] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);

  useEffect(() => {
    try {
      sessionStorage.setItem("isSignUp", isSignUp ? "true" : "false");
    } catch { /* Ignore */ }
  }, [isSignUp]);

  useEffect(() => {
    if (isSignUp && password) {
      const { valid, message } = validatePasswordStrength(password);
      setPasswordStrengthMsg(message);
      setPasswordValid(valid);
    } else {
      setPasswordStrengthMsg("");
      setPasswordValid(true);
    }
  }, [password, isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
            },
          },
        });
        if (error) {
          if (
            error.message &&
            error.message.toLowerCase().includes("duplicate key value") &&
            error.message.includes("profiles_email_key")
          ) {
            setError("This email address is already in use.");
            toast({
              title: "Sign up error",
              description: "This email address is already in use.",
              variant: "destructive",
            });
          } else {
            setError(error.message);
            toast({
              title: "Sign up error",
              description: error.message,
              variant: "destructive",
            });
          }
          setIsLoading(false);
          return;
        }
        toast({
          title: "Account created",
          description: "Sign up successful! Please check your email for confirmation (or log in if already confirmed).",
        });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(error.message);
          toast({
            title: "Login error",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        toast({
          title: "Welcome back!",
          description: "Signed in successfully",
        });
        navigate("/");
      }
    } catch (error) {
      const result = handleError(error as Error);
      setError(result.error);
      toast({
        title: isSignUp ? "Sign up error" : "Login error",
        description: result.error,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md space-y-5">
        {/* Breadcrumbs and Back to Home */}
        <div className="flex items-center justify-between pb-2">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={e => { e.preventDefault(); navigate("/"); }}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{isSignUp ? "Sign Up" : "Sign In"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Back to home button */}
          <Button variant="outline" className="ml-3" size="sm" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{isSignUp ? "Create an account" : "Sign in"}</CardTitle>
            <CardDescription>
              {isSignUp
                ? "Join Creator Chapter to start collaborating with brands"
                : "Welcome back! Sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-primary"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {isSignUp && password && (
                  <p
                    className={`text-xs mt-1 ${passwordValid ? "text-green-600" : "text-red-500"}`}
                  >
                    {passwordValid
                      ? "Password meets requirements."
                      : passwordStrengthMsg}
                  </p>
                )}
              </div>

              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>I am a...</Label>
                    <RadioGroup value={role} onValueChange={(v: "creator" | "brand") => setRole(v)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="creator" id="creator" />
                        <Label htmlFor="creator">Creator</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="brand" id="brand" />
                        <Label htmlFor="brand">Brand</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading || (isSignUp && !passwordValid)}>
                {isLoading
                  ? "Please wait..."
                  : isSignUp
                    ? "Create account"
                    : "Sign in"}
              </Button>

              <p className="text-sm text-center">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:underline"
                >
                  {isSignUp ? "Sign in" : "Create one"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";
import ConfettiCheck from "@/components/ConfettiCheck";
import LoadingOverlay from "@/components/LoadingOverlay";
import PasswordField from "./PasswordField";
import { validateEmail, validateFullName } from "@/lib/validation";
import { validatePasswordStrength } from "@/lib/passwordStrength";

type Props = {};

export default function AuthForm({}: Props) {
  const navigate = useNavigate();
  const lastIsSignUp = (() => {
    try { return sessionStorage.getItem("isSignUp") === "true"; }
    catch { return true; }
  })();

  const [isSignUp, setIsSignUp] = useState(lastIsSignUp);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"creator" | "brand">("creator");
  const [celebrating, setCelebrating] = useState(false);

  // Validation state
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [passwordValid, setPasswordValid] = useState(true);

  useEffect(() => {
    try { sessionStorage.setItem("isSignUp", isSignUp ? "true" : "false"); }
    catch {}
  }, [isSignUp]);

  useEffect(() => {
    if (isSignUp && password) {
      const { valid } = validatePasswordStrength(password);
      setPasswordValid(valid);
    } else {
      setPasswordValid(true);
    }
  }, [password, isSignUp]);

  // Validation helpers
  const validateAll = () => {
    const newErrors: {[key: string]: string} = {};
    if (!validateEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (isSignUp && !validatePasswordStrength(password).valid) {
      newErrors.password = validatePasswordStrength(password).message || "Password not strong enough";
    }
    if (isSignUp && !validateFullName(fullName)) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({}); // clear
    const errors = validateAll();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast({
        title: "Check your form",
        description: Object.values(errors).join(". "),
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role }
          }
        });
        if (error) {
          // Hide implementation details from user, but log for developers
          if (
            error.message &&
            error.message.toLowerCase().includes("duplicate key value") &&
            error.message.includes("profiles_email_key")
          ) {
            console.error("Sign up error: Duplicate email", error);
            toast({
              title: "Sign up error",
              description: "Email is already in use.",
              variant: "destructive",
            });
          } else {
            console.error("Sign up error:", error);
            toast({
              title: "Sign up error",
              description: "Something went wrong. Try again.",
              variant: "destructive",
            });
          }
          setIsLoading(false);
          return;
        }
        // Success
        setCelebrating(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email, password,
        });
        if (error) {
          console.error("Login error:", error);
          toast({
            title: "Login error",
            description: "Invalid credentials. Try again.",
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
      console.error("Auth error:", result.error);
      toast({
        title: isSignUp ? "Sign up error" : "Login error",
        description: "Unexpected error. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // After celebration, redirect to home
  useEffect(() => {
    if (!celebrating) return;
    const timeout = setTimeout(() => {
      setCelebrating(false);
      navigate("/");
    }, 1350);
    return () => clearTimeout(timeout);
  }, [celebrating, navigate]);

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      {isLoading && <LoadingOverlay />}
      {celebrating && <ConfettiCheck />}
      <div className="w-full max-w-md space-y-5">
        {/* Breadcrumbs and Back to Home */}
        <div className="flex items-center justify-between pb-2">
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
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-500">{fieldErrors.email}</p>
                )}
              </div>
              <PasswordField
                value={password}
                onChange={setPassword}
                error={fieldErrors.password}
                isSignUp={isSignUp}
              />
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                    />
                    {fieldErrors.fullName && (
                      <p className="text-xs text-red-500">{fieldErrors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>I am a...</Label>
                    <RadioGroup value={role} onValueChange={v => setRole(v as "creator" | "brand")}>
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
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || (isSignUp && !passwordValid)}
              >
                {isLoading
                  ? "Please wait..."
                  : isSignUp ? "Create account" : "Sign in"}
              </Button>
              <p className="text-sm text-center">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setFieldErrors({});
                  }}
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

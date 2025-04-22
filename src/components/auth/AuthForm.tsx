
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

  // --- DESIGN ENHANCEMENT STYLES ---
  // Tailwind classes are used. See index.css for .glass-card, .card-gradient, .btn-neon, font classes, etc.

  return (
    <div className="container flex items-center justify-center min-h-screen py-10 bg-gradient-to-br from-[#191826] via-[#262B3A]/80 to-[#161619]">
      {isLoading && <LoadingOverlay />}
      {celebrating && <ConfettiCheck />}
      <div className="w-full max-w-md space-y-5">
        {/* Header with Breadcrumb and Back */}
        <div className="flex items-center justify-between pb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={e => { e.preventDefault(); navigate("/"); }} className="text-muted-foreground hover:text-primary font-medium font-space transition-colors">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-primary font-bold font-space tracking-wide">{isSignUp ? "Sign Up" : "Sign In"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="outline" className="ml-3 px-3 py-1 rounded-lg font-inter border-2 hover:shadow-md hover:border-primary transition" size="sm" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
        {/* Card */}
        <Card className="w-full glass-card card-gradient drop-shadow-2xl transition-all">
          <CardHeader className="pb-4 pt-7">
            <CardTitle className="text-3xl md:text-4xl font-space font-bold bg-gradient-to-r from-primary to-neon bg-clip-text text-transparent tracking-tight drop-shadow">
              {isSignUp ? "Create your account" : "Sign in"}
            </CardTitle>
            <CardDescription className="font-manrope text-base text-muted-foreground mt-1">
              {isSignUp
                ? "Join Creator Chapter and start collaborating with brands"
                : "Welcome back — sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="py-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-inter font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="focus:ring-2 focus:ring-neon transition ring-offset-2 bg-background/80 border border-border placeholder:text-muted-foreground font-manrope"
                  placeholder="your@email.com"
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-500 font-inter pl-1 pt-1">{fieldErrors.email}</p>
                )}
              </div>
              {/* Password */}
              <PasswordField
                value={password}
                onChange={setPassword}
                error={fieldErrors.password}
                isSignUp={isSignUp}
              />
              {/* Sign up fields */}
              {isSignUp && (
                <div className="space-y-2 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-base font-inter font-medium">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                      className="focus:ring-2 focus:ring-neon transition ring-offset-2 bg-background/80 border border-border placeholder:text-muted-foreground font-manrope"
                      placeholder="Your full name"
                    />
                    {fieldErrors.fullName && (
                      <p className="text-xs text-red-500 font-inter pl-1 pt-1">{fieldErrors.fullName}</p>
                    )}
                  </div>
                  {/* Role */}
                  <div className="space-y-2">
                    <Label className="text-base font-inter font-medium">I am a...</Label>
                    <RadioGroup value={role} onValueChange={v => setRole(v as "creator" | "brand")} className="flex items-center gap-8 pt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="creator" id="creator" />
                        <Label htmlFor="creator" className="font-manrope">Creator</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="brand" id="brand" />
                        <Label htmlFor="brand" className="font-manrope">Brand</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
              {/* Submit */}
              <Button
                type="submit"
                className="w-full btn-neon text-lg font-bold mt-4 shadow-lg transition hover:scale-105 duration-300"
                disabled={isLoading || (isSignUp && !passwordValid)}
              >
                {isLoading
                  ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-darkbg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      Please wait...
                    </span>
                  )
                  : isSignUp ? "Create account" : "Sign in"}
              </Button>
              {/* Switch sign in/up */}
              <p className="text-sm text-center font-manrope mt-6">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setFieldErrors({});
                  }}
                  className="text-primary underline underline-offset-2 hover:text-neon font-medium transition"
                >
                  {isSignUp ? "Sign in" : "Create one"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
        {/* Divider to visually improve, optional */}
        {/* <div className="flex items-center justify-center mt-3">
          <span className="h-0.5 w-20 bg-gradient-to-r from-neon/60 to-primary block rounded-full" />
        </div> */}
      </div>
    </div>
  );
}

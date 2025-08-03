
// ----------------------------------
// AuthForm v2 - Refactored into smaller components
// ----------------------------------
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";
import { validateEmail, validateFullName } from "@/lib/validation";
import { validatePasswordStrength } from "@/lib/passwordStrength";
import { createInitialProfile } from "@/services/profileCreationService";
import AuthHeader from "./AuthHeader";
import AuthPremiumHeader from "./AuthPremiumHeader";
import AuthGlassCard from "./AuthGlassCard";
import AuthSwitchFooter from "./AuthSwitchFooter";
import AuthFormCard from "./AuthFormCard";
import AuthFields from "./AuthFields";
import AuthSubmitButton from "./AuthSubmitButton";
import AuthBrandStatement from "./AuthBrandStatement";

export default function AuthForm() {
  const navigate = useNavigate();
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
  const [celebrating, setCelebrating] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [passwordValid, setPasswordValid] = useState(true);

  useEffect(() => {
    try { 
      sessionStorage.setItem("isSignUp", isSignUp ? "true" : "false"); 
    } catch (error) {
      // Ignore sessionStorage errors in private browsing mode
    }
  }, [isSignUp]);

  useEffect(() => {
    if (isSignUp && password) {
      setPasswordValid(validatePasswordStrength(password).valid);
    } else { setPasswordValid(true); }
  }, [password, isSignUp]);

  const validateAll = () => {
    const newErrors: { [key: string]: string } = {};
    if (!validateEmail(email)) newErrors.email = "Enter a valid email address";
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
    setFieldErrors({});
    const errors = validateAll();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast({
        title: "Please check your info",
        description: Object.values(errors).join(". "),
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, role } }
        });
        
        if (error) {
          if (error.message && error.message.toLowerCase().includes("duplicate key value") && error.message.includes("profiles_email_key")) {
            toast({ title: "Sign up error", description: "Email is already in use.", variant: "destructive" });
          } else {
            toast({ title: "Sign up error", description: "Something went wrong. Try again.", variant: "destructive" });
          }
          setIsLoading(false);
          return;
        }

        // Create initial profile entries
        if (data.user) {
          const profileResult = await createInitialProfile({
            userId: data.user.id,
            email,
            fullName,
            role
          });

          if (!profileResult.success) {
            toast({ 
              title: "Profile creation error", 
              description: profileResult.error || "Failed to create profile",
              variant: "destructive" 
            });
            setIsLoading(false);
            return;
          }
        }

        toast({ title: "Account created!", description: "Welcome to Creator Chapter" });
        
        // Redirect new users to the appropriate onboarding
        if (role === "brand") {
          navigate("/brand-onboarding");
        } else {
          navigate("/onboarding");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast({ title: "Login error", description: "Invalid credentials. Try again.", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        // Let the auth state change handler manage the redirection
        // This prevents race conditions and ensures proper profile loading
        
        // The useEffect in App.tsx will handle the redirection based on role
        // after the profile is properly loaded
      }
    } catch (error) {
      handleError(error as Error);
      toast({
        title: isSignUp ? "Sign up error" : "Login error",
        description: "Unexpected error. Try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // We no longer need celebrating state since we navigate directly now
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#191826] via-[#252838]/80 to-[#181923] pb-4">
      <div className="flex justify-center items-start pt-5 sm:pt-10 pb-2 w-full">
        <div className="w-full max-w-lg mx-auto">
          <AuthHeader isSignUp={isSignUp} />
        </div>
      </div>
      <AuthFormCard isSignUp={isSignUp} isLoading={isLoading} celebrating={celebrating}>
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-7 flex flex-col items-center justify-center mt-2"
          autoComplete="on"
        >
          <AuthFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isSignUp={isSignUp}
            fullName={fullName}
            setFullName={setFullName}
            role={role}
            setRole={setRole}
            fieldErrors={fieldErrors}
            passwordValid={passwordValid}
          />
          <AuthSubmitButton
            isLoading={isLoading}
            isSignUp={isSignUp}
            disabled={isLoading || (isSignUp && !passwordValid)}
          />
          <AuthSwitchFooter isSignUp={isSignUp} onToggle={() => { setIsSignUp(!isSignUp); setFieldErrors({}); }} />
        </form>
        <AuthBrandStatement />
      </AuthFormCard>
    </div>
  );
}


// ----------------------------------
// Refactored AuthForm.tsx
// - Modularized layout
// - Applied premium, clean "Chapter Creator" brand style and updated all Dealflow language
// - Simplified code for clarity
// ----------------------------------

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ConfettiCheck from "@/components/ConfettiCheck";
import LoadingOverlay from "@/components/LoadingOverlay";
import PasswordField from "./PasswordField";
import AuthEmailField from "./AuthEmailField";
import AuthFullNameField from "./AuthFullNameField";
import AuthSwitchFooter from "./AuthSwitchFooter";
import { validateEmail, validateFullName } from "@/lib/validation";
import { validatePasswordStrength } from "@/lib/passwordStrength";
import RoleSelector from "./RoleSelector";
import AuthHeader from "./AuthHeader";

type Props = {};

function FormHeader({ isSignUp }: { isSignUp: boolean }) {
  return (
    <div className="text-center pt-8 pb-3">
      <h2 className="text-3xl md:text-4xl font-space font-extrabold tracking-tight bg-gradient-to-tr from-primary to-neon bg-clip-text text-transparent drop-shadow mb-2">
        {isSignUp
          ? (<><span className="inline-block text-neon">Sign Up</span> <span className="inline-block text-primary">for Chapter Creator</span></>)
          : (<span className="inline-block text-primary">Sign In</span>)
        }
      </h2>
      <p className="font-manrope text-base text-muted-foreground mt-2">
        {isSignUp
          ? "Join Chapter Creator to collaborate with premium brands and creators."
          : "Welcome back to Chapter Creator — sign in to your account."}
      </p>
    </div>
  );
}

function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-lg mx-auto space-y-3">
      <div className="glass-card card-gradient drop-shadow-2xl transition-all border border-glassBorder bg-glassBg/90 backdrop-blur-lg rounded-2xl px-8 sm:px-10 py-10">
        {children}
      </div>
    </div>
  );
}

export default function AuthForm({}: Props) {
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

  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [passwordValid, setPasswordValid] = useState(true);

  useEffect(() => {
    try { sessionStorage.setItem("isSignUp", isSignUp ? "true" : "false"); } catch {}
  }, [isSignUp]);

  useEffect(() => {
    if (isSignUp && password) {
      setPasswordValid(validatePasswordStrength(password).valid);
    } else { setPasswordValid(true); }
  }, [password, isSignUp]);

  const validateAll = () => {
    const newErrors: {[key: string]: string} = {};
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
        setCelebrating(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast({ title: "Login error", description: "Invalid credentials. Try again.", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        toast({ title: "Welcome back!", description: "Signed in successfully" });
        navigate("/");
      }
    } catch (error) {
      const result = handleError(error as Error);
      toast({
        title: isSignUp ? "Sign up error" : "Login error",
        description: "Unexpected error. Try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!celebrating) return;
    const timeout = setTimeout(() => {
      setCelebrating(false);
      navigate("/");
    }, 1350);
    return () => clearTimeout(timeout);
  }, [celebrating, navigate]);

  return (
    <div className="container flex items-center justify-center min-h-screen py-10 bg-gradient-to-br from-[#191826] via-[#252838]/90 to-[#161619] relative">
      {isLoading && <LoadingOverlay />}
      {celebrating && <ConfettiCheck />}

      {/* Breadcrumb and Back to Home */}
      <AuthHeader isSignUp={isSignUp} />

      <FormContainer>
        <FormHeader isSignUp={isSignUp} />
        <form onSubmit={handleSubmit} className="space-y-8" autoComplete="on">
          <AuthEmailField email={email} setEmail={setEmail} error={fieldErrors.email} />
          <PasswordField value={password} onChange={setPassword} error={fieldErrors.password} isSignUp={isSignUp} />
          {isSignUp && (
            <div className="space-y-3 animate-fade-in">
              <AuthFullNameField fullName={fullName} setFullName={setFullName} error={fieldErrors.fullName} />
              <RoleSelector value={role} onChange={setRole} />
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-neon text-darkbg text-lg font-extrabold tracking-wide shadow-lg transition hover:scale-[1.03] hover:bg-primary hover:text-white duration-200 mt-2 px-6 py-3 rounded-full border-none"
            disabled={isLoading || (isSignUp && !passwordValid)}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-darkbg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Please wait...
              </span>
            ) : (
              isSignUp ? "Create Account" : "Sign In"
            )}
          </Button>
          <AuthSwitchFooter isSignUp={isSignUp} onToggle={() => { setIsSignUp(!isSignUp); setFieldErrors({}); }} />
        </form>
      </FormContainer>
    </div>
  );
}
// NOTE: This file is now cleaner and modularized. It's over 150 lines, so please consider further refactoring if adding more logic/UI!

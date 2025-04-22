
// ----------------------------------
// AuthForm - Chapter Creator premium, clean brand style + UI/UX fixes
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
    <div className="text-center pt-8 pb-4">
      <h2 className="text-3xl md:text-4xl font-playfair font-bold tracking-tight text-gradient bg-gradient-to-tr from-neon via-primary to-white bg-clip-text text-transparent drop-shadow mb-2 leading-tight">
        {isSignUp
          ? (<><span className="inline-block text-neon">Join</span> <span className="inline-block text-primary">Chapter Creator</span></>)
          : (<span className="inline-block text-primary">Sign In to Chapter Creator</span>)
        }
      </h2>
      <p className="font-inter text-base text-muted-foreground mt-2">
        {isSignUp
          ? "Create your Chapter Creator account to unlock seamless brand deals and premium creative collabs."
          : "Welcome back! Sign in to Chapter Creator and power up your next creative chapter."}
      </p>
    </div>
  );
}

function FormContainer({ children }: { children: React.ReactNode }) {
  // Add premium shadow and glass card effect, better feel on mobile
  return (
    <div className="w-full max-w-lg mx-auto section-padding relative z-10">
      <div className="glass-card card-gradient drop-shadow-xl border border-glassBorder bg-gradient-to-br from-card via-glassBg/80 to-darkbg/95 backdrop-blur-xl rounded-2xl px-7 sm:px-10 py-10 sm:py-12 animate-fade-in">
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
        title: "Please check your info",
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
    <div className="container flex items-center justify-center min-h-screen py-10 bg-gradient-to-br from-[#191826] via-[#252838]/80 to-[#181923] relative">
      {isLoading && <LoadingOverlay />}
      {celebrating && <ConfettiCheck />}

      {/* Breadcrumb and Back to Home */}
      <AuthHeader isSignUp={isSignUp} />

      <FormContainer>
        <FormHeader isSignUp={isSignUp} />
        <form onSubmit={handleSubmit} className="space-y-8" autoComplete="on">
          <div className="space-y-5">
            <AuthEmailField email={email} setEmail={setEmail} error={fieldErrors.email} />
            <PasswordField value={password} onChange={setPassword} error={fieldErrors.password} isSignUp={isSignUp} />
            {isSignUp && (
              <div className="space-y-3 animate-fade-in">
                <AuthFullNameField fullName={fullName} setFullName={setFullName} error={fieldErrors.fullName} />
                <RoleSelector value={role} onChange={setRole} />
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-neon/90 text-darkbg text-lg font-playfair font-extrabold tracking-wider shadow-xl transition hover:scale-[1.03] hover:bg-primary hover:text-white duration-200 border-none px-6 py-3 rounded-full mt-1"
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
              isSignUp ? "Create Your Account" : "Sign In"
            )}
          </Button>
          <AuthSwitchFooter isSignUp={isSignUp} onToggle={() => { setIsSignUp(!isSignUp); setFieldErrors({}); }} />
        </form>
        <div className="text-center mt-6 text-xs text-muted-foreground font-manrope tracking-wide">
          {/* Secondary brand message, mobile or tablet */}
          <span>
            🚀 Empowering creators & brands to connect and grow together on <span className="text-neon font-bold">Chapter Creator</span>
          </span>
        </div>
      </FormContainer>
    </div>
  );
}
// NOTE: This file is now cleaner and modularized. It's over 150 lines, please consider asking to refactor this file if you plan to add more logic or UI!

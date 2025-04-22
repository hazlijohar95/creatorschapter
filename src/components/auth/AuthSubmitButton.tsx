
import React from "react";
import { Button } from "@/components/ui/button";

type AuthSubmitButtonProps = {
  isLoading: boolean;
  isSignUp: boolean;
  disabled: boolean;
};

export default function AuthSubmitButton({
  isLoading,
  isSignUp,
  disabled,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full bg-neon/90 text-darkbg text-lg font-playfair font-extrabold tracking-wider shadow-xl transition hover:scale-[1.03] hover:bg-primary hover:text-white duration-200 border-none px-6 py-3 rounded-full mt-0"
      disabled={disabled}
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
  );
}

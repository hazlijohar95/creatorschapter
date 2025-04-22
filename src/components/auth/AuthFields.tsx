
import React from "react";
import PasswordField from "./PasswordField";
import AuthEmailField from "./AuthEmailField";
import AuthFullNameField from "./AuthFullNameField";
import RoleSelector from "./RoleSelector";

type AuthFieldsProps = {
  email: string;
  setEmail: (e: string) => void;
  password: string;
  setPassword: (e: string) => void;
  isSignUp: boolean;
  fullName: string;
  setFullName: (e: string) => void;
  role: "creator" | "brand";
  setRole: (r: "creator" | "brand") => void;
  fieldErrors: { [key: string]: string };
  passwordValid: boolean;
};

export default function AuthFields({
  email,
  setEmail,
  password,
  setPassword,
  isSignUp,
  fullName,
  setFullName,
  role,
  setRole,
  fieldErrors,
  passwordValid,
}: AuthFieldsProps) {
  return (
    <div className="w-full space-y-4">
      <AuthEmailField email={email} setEmail={setEmail} error={fieldErrors.email} />
      <PasswordField value={password} onChange={setPassword} error={fieldErrors.password} isSignUp={isSignUp} />
      {isSignUp && (
        <div className="space-y-3 animate-fade-in">
          <AuthFullNameField fullName={fullName} setFullName={setFullName} error={fieldErrors.fullName} />
          <RoleSelector value={role} onChange={setRole} />
        </div>
      )}
    </div>
  );
}

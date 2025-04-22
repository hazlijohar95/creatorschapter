
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validatePasswordStrength } from "@/lib/passwordStrength";

type Props = {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  isSignUp: boolean;
};

export default function PasswordField({ value, onChange, error, isSignUp }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [strengthMsg, setStrengthMsg] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (isSignUp && value) {
      const { valid, message } = validatePasswordStrength(value);
      setStrengthMsg(message);
      setIsValid(valid);
    } else {
      setStrengthMsg("");
      setIsValid(true);
    }
  }, [isSignUp, value]);

  return (
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          required
          autoComplete={isSignUp ? "new-password" : "current-password"}
          aria-invalid={!!error}
          aria-describedby={error ? "password-error" : undefined}
        />
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-primary"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {isSignUp && value && (
        <p
          className={`text-xs mt-1 ${isValid ? "text-green-600" : "text-red-500"}`}
        >
          {isValid
            ? "Password meets requirements."
            : strengthMsg}
        </p>
      )}
      {error && (
        <p id="password-error" className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

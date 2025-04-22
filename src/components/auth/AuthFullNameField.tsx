
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFullNameFieldProps = {
  fullName: string;
  setFullName: (v: string) => void;
  error?: string;
};

export default function AuthFullNameField({ fullName, setFullName, error }: AuthFullNameFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="fullName" className="text-base font-inter font-medium">
        Full Name
      </Label>
      <Input
        id="fullName"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
        required
        className="focus:ring-2 focus:ring-neon ring-offset-2 bg-background/75 border border-border placeholder:text-muted-foreground font-manrope"
        placeholder="Your full name"
        aria-label="Full name"
      />
      {error && (
        <p className="text-xs text-red-500 font-inter pl-1 pt-1">
          {error}
        </p>
      )}
    </div>
  );
}

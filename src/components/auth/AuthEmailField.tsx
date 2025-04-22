
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type AuthEmailFieldProps = {
  email: string;
  setEmail: (v: string) => void;
  error?: string;
};
export default function AuthEmailField({
  email,
  setEmail,
  error
}: AuthEmailFieldProps) {
  return <div className="space-y-2">
      <Label htmlFor="email" className="text-base font-inter font-medium text-black bg-transparent">
        Email
      </Label>
      <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="focus:ring-2 focus:ring-neon ring-offset-2 bg-background/75 border border-border placeholder:text-black/70 font-manrope text-black" placeholder="your@email.com" aria-label="Email" />
      {error && <p className="text-xs text-red-500 font-inter pl-1 pt-1">
          {error}
        </p>}
    </div>;
}

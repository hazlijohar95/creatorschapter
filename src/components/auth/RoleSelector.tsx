
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
type RoleSelectorProps = {
  value: "creator" | "brand";
  onChange: (role: "creator" | "brand") => void;
  disabled?: boolean;
};
export default function RoleSelector({
  value,
  onChange,
  disabled
}: RoleSelectorProps) {
  return <div className="space-y-2">
      <Label className="text-base font-inter font-medium text-black">I am a...</Label>
      <RadioGroup value={value} defaultValue="creator" onValueChange={v => onChange(v as "creator" | "brand")} className="flex items-center gap-8 pt-2" disabled={disabled}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="creator" id="creator" />
          <Label htmlFor="creator" className="font-manrope-black text-black">Creator</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="brand" id="brand" />
          <Label htmlFor="brand" className="font-manrope text-black">Brand</Label>
        </div>
      </RadioGroup>
    </div>;
}

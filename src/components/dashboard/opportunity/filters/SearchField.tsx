
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SearchFieldProps } from "@/types/components/filters";

export function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <div className="relative w-full max-w-lg">
      <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search opportunities..."
        className="w-full pl-8 bg-white border-gray-200 shadow-sm rounded-xl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search opportunities"
      />
    </div>
  );
}

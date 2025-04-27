
import { Slider } from "@/components/ui/slider";

interface MatchScoreFilterProps {
  minMatch: number;
  maxMatch: number;
  onChange: (values: [number, number]) => void;
}

export function MatchScoreFilter({ minMatch, maxMatch, onChange }: MatchScoreFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Match Score Range</label>
        <span className="text-sm text-muted-foreground">
          {minMatch}% - {maxMatch}%
        </span>
      </div>
      <Slider
        defaultValue={[minMatch, maxMatch]}
        min={0}
        max={100}
        step={5}
        onValueChange={onChange}
      />
    </div>
  );
}

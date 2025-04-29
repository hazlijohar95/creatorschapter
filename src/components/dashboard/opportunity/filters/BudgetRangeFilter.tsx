
import { Input } from "@/components/ui/input";

interface BudgetRangeFilterProps {
  minBudget: number | null;
  maxBudget: number | null;
  onBudgetChange: (min: number | null, max: number | null) => void;
}

export function BudgetRangeFilter({
  minBudget,
  maxBudget,
  onBudgetChange,
}: BudgetRangeFilterProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Budget Range ($)</h4>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Min"
          value={minBudget || ""}
          onChange={(e) =>
            onBudgetChange(
              e.target.value ? Number(e.target.value) : null,
              maxBudget
            )
          }
        />
        <span>-</span>
        <Input
          type="number"
          placeholder="Max"
          value={maxBudget || ""}
          onChange={(e) =>
            onBudgetChange(
              minBudget,
              e.target.value ? Number(e.target.value) : null
            )
          }
        />
      </div>
    </div>
  );
}

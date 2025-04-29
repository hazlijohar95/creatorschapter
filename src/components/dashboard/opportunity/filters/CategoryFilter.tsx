
import { Badge } from "@/components/ui/badge";
import { CategoryFilterProps } from "@/types/components/filters";

export function CategoryFilter({
  categories,
  selectedCategories,
  onToggleCategory,
}: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Categories</h4>
      <div className="flex flex-wrap gap-1">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onToggleCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}


import { Badge } from "@/components/ui/badge";

export function ApplicationDetailTags({ categories }: { categories: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {categories.map(tag => (
        <Badge key={tag} variant="secondary" className="bg-secondary/90 font-medium">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

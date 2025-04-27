
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface CampaignFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CampaignFilters({ searchQuery, onSearchChange }: CampaignFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-auto md:min-w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline" className="w-full md:w-auto">
        <Filter className="mr-2 h-4 w-4" />
        Filters
      </Button>
    </div>
  );
}

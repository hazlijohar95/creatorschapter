
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const CATEGORY_OPTIONS = ["Fashion", "Beauty", "Travel", "Food", "Fitness", "Tech", "Lifestyle", "Gaming", "Music", "Art"];
const FOLLOWER_RANGES = ["Any", "10K+", "50K+", "100K+", "500K+", "1M+"];

interface CreatorFiltersProps {
  filters: {
    categories: string[];
    location: string;
  };
  toggleCategory: (category: string) => void;
  setLocation: (location: string) => void;
  setFollowerRange: (range: string) => void;
  selectedFollowerRange: string;
}

export function CreatorFilters({ 
  filters, 
  toggleCategory, 
  setLocation, 
  setFollowerRange,
  selectedFollowerRange
}: CreatorFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-medium">Filter Creators</h3>
        <Separator />
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((category) => (
              <Badge 
                key={category} 
                variant={filters.categories.includes(category) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Follower Count</h4>
          <div className="flex flex-wrap gap-2">
            {FOLLOWER_RANGES.map((range) => (
              <Badge 
                key={range} 
                variant={range === selectedFollowerRange ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFollowerRange(range)}
              >
                {range}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Location</h4>
          <Input 
            placeholder="e.g. New York, London..." 
            value={filters.location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

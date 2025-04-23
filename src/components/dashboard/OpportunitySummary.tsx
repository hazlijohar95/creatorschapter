
import { Badge } from "@/components/ui/badge";
import { BarChart, Search } from "lucide-react";

export function OpportunitySummary({
  total,
  shown,
  searchQuery,
}: {
  total: number;
  shown: number;
  searchQuery: string;
}) {
  return (
    <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 px-0 md:px-2">
      <div className="mb-2 sm:mb-0">
        <h1 className="font-space text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <BarChart className="w-6 h-6 text-primary" />
          Discover Opportunities
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl font-normal">
          Explore the latest brand deals, collaborations, and exclusive campaigns—tailored to your content and audience. Search, filter, and find your next big win.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Badge variant="secondary" className="bg-white/5 text-primary-foreground font-semibold shadow border border-gray-800">
          Total: <span className="ml-1">{total}</span>
        </Badge>
        <Badge variant="default" className="bg-primary text-primary-foreground font-semibold shadow">
          Showing: <span className="ml-1">{shown}</span>
        </Badge>
        {searchQuery && (
          <Badge variant="outline" className="inline-flex items-center text-blue-700 border-blue-300 bg-blue-50">
            <Search className="w-3.5 h-3.5 mr-1 text-blue-600" />
            "{searchQuery}"
          </Badge>
        )}
      </div>
    </section>
  );
}

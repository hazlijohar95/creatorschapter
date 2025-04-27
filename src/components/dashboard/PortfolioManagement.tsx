import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { CardSkeleton } from "@/components/shared/CardSkeleton";
import { ErrorFallback } from "@/components/shared/ErrorFallback";
import { EmptyState } from "@/components/shared/EmptyState";
import { FolderOpen } from "lucide-react";

export default function PortfolioManagement() {
  const { user } = useAuthStore();

  const { data: portfolio = [], isLoading, error, refetch } = useQuery({
    queryKey: ["portfolio", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("id, title, description, media_url, external_link, view_count")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Your Portfolio</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Your Portfolio</h1>
        <ErrorFallback 
          error={error as Error} 
          message="Failed to load portfolio" 
          resetErrorBoundary={() => refetch()}
        />
      </div>
    );
  }

  if (portfolio.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Your Portfolio</h1>
        <EmptyState
          icon={<FolderOpen className="w-12 h-12 text-muted-foreground" />}
          title="No portfolio items yet"
          description="Start building your portfolio by adding your best work"
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Your Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolio.map((item: any) => (
          <div key={item.id} className="p-5 bg-white rounded-lg shadow border">
            <h2 className="font-bold text-lg mb-2">{item.title}</h2>
            <p className="mb-2">{item.description}</p>
            <div className="flex items-center gap-3">
              {item.media_url && (
                <a href={item.media_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  Media
                </a>
              )}
              {item.external_link && (
                <a href={item.external_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  External Link
                </a>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Views: {item.view_count ?? 0}
            </div>
          </div>
        ))}
        {portfolio.length === 0 && (
          <div className="col-span-2 text-gray-500 text-center py-10">
            You have not added any portfolio items yet.
          </div>
        )}
      </div>
    </div>
  );
}

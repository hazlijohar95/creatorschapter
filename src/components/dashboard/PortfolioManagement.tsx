import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";

export default function PortfolioManagement() {
  const { user } = useAuthStore();

  // Fetch portfolio items for the creator
  const { data: portfolio = [] } = useQuery({
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

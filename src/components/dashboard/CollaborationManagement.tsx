import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CollaborationCard } from "./collaborations/CollaborationCard";
import { useCollaborations } from "./collaborations/useCollaborations";
import { CollaborationCalendar } from "./collaborations/CollaborationCalendar";
import { Calendar, BarChart2 } from "lucide-react";
import { CardSkeleton } from "@/components/shared/CardSkeleton";
import { ErrorFallback } from "@/components/shared/ErrorFallback";
import { EmptyState } from "@/components/shared/EmptyState";

export default function CollaborationManagement() {
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "completed" | "all">("active");
  const [view, setView] = useState<"list" | "calendar">("list");
  
  const { collaborations, isLoading, error, refetch } = useCollaborations(activeTab);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Collaborations</h2>
          <div className="flex items-center gap-2">
            <div className="border rounded-md overflow-hidden flex">
              <Button variant="ghost" size="sm" className="rounded-none">
                <BarChart2 className="h-4 w-4 mr-1" /> List
              </Button>
              <Button variant="ghost" size="sm" className="rounded-none">
                <Calendar className="h-4 w-4 mr-1" /> Calendar
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} rows={4} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Collaborations</h2>
        <ErrorFallback 
          error={error as Error} 
          message="Failed to load collaborations" 
          resetErrorBoundary={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Collaborations</h2>
        <div className="flex items-center gap-2">
          <div className="border rounded-md overflow-hidden flex">
            <Button 
              variant={view === "list" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setView("list")}
              className="rounded-none"
            >
              <BarChart2 className="h-4 w-4 mr-1" /> List
            </Button>
            <Button 
              variant={view === "calendar" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setView("calendar")}
              className="rounded-none"
            >
              <Calendar className="h-4 w-4 mr-1" /> Calendar
            </Button>
          </div>
        </div>
      </div>

      {view === "calendar" ? (
        <CollaborationCalendar collaborations={collaborations} />
      ) : (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="active">
              Active {collaborations.filter(c => c.status === "active").length > 0 && 
                `(${collaborations.filter(c => c.status === "active").length})`}
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending {collaborations.filter(c => c.status === "pending").length > 0 && 
                `(${collaborations.filter(c => c.status === "pending").length})`}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed {collaborations.filter(c => c.status === "completed").length > 0 && 
                `(${collaborations.filter(c => c.status === "completed").length})`}
            </TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-2">Error loading collaborations</p>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          ) : (
            <TabsContent value={activeTab} className="mt-6">
              {collaborations.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-slate-50">
                  <h3 className="text-lg font-medium mb-2">No {activeTab !== "all" ? activeTab : ""} collaborations found</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === "pending" 
                      ? "You don't have any pending collaboration requests at the moment." 
                      : activeTab === "active" 
                        ? "You don't have any active collaborations currently." 
                        : activeTab === "completed" 
                          ? "You haven't completed any collaborations yet."
                          : "You don't have any collaborations yet."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {collaborations.map((collab) => (
                    <CollaborationCard 
                      key={collab.id} 
                      collaboration={collab} 
                      onStatusChange={refetch}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}

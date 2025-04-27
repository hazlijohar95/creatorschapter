
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { format } from "date-fns";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Campaign {
  id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  status: string;
}

export function CampaignCalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateEvents, setSelectedDateEvents] = useState<Campaign[]>([]);
  
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCampaigns() {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('campaigns')
          .select('id, name, start_date, end_date, status')
          .eq('brand_id', user.id);
          
        if (error) throw error;
        setCampaigns(data || []);

        // Set selected date events
        if (date) {
          findEventsForDate(date, data || []);
        }
      } catch (error) {
        console.error('Error fetching campaigns for calendar:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCampaigns();
  }, [user?.id]);

  useEffect(() => {
    if (date) {
      findEventsForDate(date, campaigns);
    }
  }, [date]);

  const findEventsForDate = (selectedDate: Date, campaignList: Campaign[]) => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const eventsOnDate = campaignList.filter(campaign => {
      if (!campaign.start_date || !campaign.end_date) return false;
      
      const startDate = campaign.start_date;
      const endDate = campaign.end_date;
      
      return formattedDate >= startDate && formattedDate <= endDate;
    });
    
    setSelectedDateEvents(eventsOnDate);
  };
  
  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to generate CSS classes for days with events
  const dayClassNames = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    const hasEvent = campaigns.some(campaign => {
      if (!campaign.start_date || !campaign.end_date) return false;
      return formattedDate >= campaign.start_date && formattedDate <= campaign.end_date;
    });
    
    return hasEvent ? "relative before:absolute before:bottom-1 before:left-1/2 before:-translate-x-1/2 before:w-1 before:h-1 before:bg-primary before:rounded-full" : "";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className={cn("rounded-md border")}
              modifiersClassNames={{
                today: "bg-primary/10"
              }}
              modifiers={{
                customModifier: (date) => dayClassNames(date) !== ""
              }}
              classNames={{
                day_selected: cn(
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                ),
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 customModifier"
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-1 xl:col-span-2">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg">
              Events on {date ? format(date, 'MMMM d, yyyy') : 'Selected date'}
            </h3>
            
            <div className="mt-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <span className="animate-spin mr-2">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  Loading events...
                </div>
              ) : selectedDateEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  No campaigns scheduled for this date
                </div>
              ) : (
                selectedDateEvents.map(campaign => (
                  <div 
                    key={campaign.id} 
                    className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/brand-dashboard/campaigns/${campaign.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {campaign.start_date && campaign.end_date ? (
                            <>
                              {format(new Date(campaign.start_date), 'MMM d')} - 
                              {format(new Date(campaign.end_date), 'MMM d')}
                            </>
                          ) : 'Date not set'}
                        </p>
                      </div>
                      <Badge className={getCampaignStatusColor(campaign.status)}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

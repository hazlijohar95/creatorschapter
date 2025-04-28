
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  description?: string;
}

export interface CampaignCalendarViewProps {
  campaigns: Campaign[];
}

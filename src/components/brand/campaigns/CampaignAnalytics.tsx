
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface CampaignAnalyticsProps {
  data: {
    name: string;
    impressions: number;
    engagements: number;
  }[];
}

export function CampaignAnalytics({ data }: CampaignAnalyticsProps) {
  const config = {
    impressions: { color: "#0EA5E9" },
    engagements: { color: "#8B5CF6" }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px]">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="impressions" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
            <Bar dataKey="engagements" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            <ChartTooltip>
              <ChartTooltipContent />
            </ChartTooltip>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BrandOverview() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Brand Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Creator Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+5 new this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Collaborations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-medium">Alex Johnson</h3>
                <p className="text-sm text-muted-foreground">Summer Collection Campaign</p>
              </div>
              <div className="border-b pb-2">
                <h3 className="font-medium">Jamie Smith</h3>
                <p className="text-sm text-muted-foreground">Product Launch Event</p>
              </div>
              <div>
                <h3 className="font-medium">Sam Rodriguez</h3>
                <p className="text-sm text-muted-foreground">Brand Ambassador Program</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-medium">Summer Collection</h3>
                <p className="text-sm text-muted-foreground">Content Due: June 15</p>
              </div>
              <div className="border-b pb-2">
                <h3 className="font-medium">Product Launch</h3>
                <p className="text-sm text-muted-foreground">Campaign Start: July 1</p>
              </div>
              <div>
                <h3 className="font-medium">Fall Lineup</h3>
                <p className="text-sm text-muted-foreground">Planning Due: July 10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

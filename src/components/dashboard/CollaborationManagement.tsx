
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, CheckCircle, Clock, XCircle } from "lucide-react";

export default function CollaborationManagement() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="active">Active (2)</TabsTrigger>
          <TabsTrigger value="pending">Pending (3)</TabsTrigger>
          <TabsTrigger value="completed">Completed (5)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">Instagram Product Campaign</CardTitle>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> 
                    Active
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Brand:</span>
                    <span className="text-sm font-medium">FitLife Supplements</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Budget:</span>
                    <span className="text-sm font-medium">$750</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Deadline:</span>
                    <span className="text-sm font-medium">May 30, 2025</span>
                  </div>
                  <div className="pt-2 flex justify-between gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </Button>
                    <Button size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">YouTube Review Series</CardTitle>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> 
                    Active
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Brand:</span>
                    <span className="text-sm font-medium">TechGear Pro</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Budget:</span>
                    <span className="text-sm font-medium">$1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Deadline:</span>
                    <span className="text-sm font-medium">June 15, 2025</span>
                  </div>
                  <div className="pt-2 flex justify-between gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </Button>
                    <Button size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">Sponsored Blog Post</CardTitle>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> 
                    Pending
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Brand:</span>
                    <span className="text-sm font-medium">EcoLife Products</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Budget:</span>
                    <span className="text-sm font-medium">$300</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className="text-sm font-medium">Awaiting Brand Approval</span>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Follow Up
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">Stories Campaign</CardTitle>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> 
                    Pending
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Brand:</span>
                    <span className="text-sm font-medium">Travel Essentials</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Budget:</span>
                    <span className="text-sm font-medium">$450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className="text-sm font-medium">Proposal Sent</span>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <Button variant="outline" size="sm">
                      <XCircle className="mr-2 h-4 w-4" />
                      Withdraw
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Follow Up
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">Podcast Interview</CardTitle>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> 
                    Pending
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Host:</span>
                    <span className="text-sm font-medium">Creator Insights Show</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Compensation:</span>
                    <span className="text-sm font-medium">$200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className="text-sm font-medium">Preliminary Discussion</span>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message Host
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for completed collaborations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Holiday Gift Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Brand:</span>
                    <span className="text-sm font-medium">StyleBox</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Completed:</span>
                    <span className="text-sm font-medium">Dec 10, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Payment:</span>
                    <span className="text-sm font-medium text-green-600">Received ($650)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Summer Collection Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Brand:</span>
                    <span className="text-sm font-medium">Beach Vibes Co.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Completed:</span>
                    <span className="text-sm font-medium">Aug 5, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Payment:</span>
                    <span className="text-sm font-medium text-green-600">Received ($900)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

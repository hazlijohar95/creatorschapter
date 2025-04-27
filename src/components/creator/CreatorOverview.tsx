import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, MessageSquare, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function CreatorOverview() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-muted-foreground">Dashboard Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { 
            icon: Search, 
            title: "Active Opportunities", 
            value: "3", 
            change: "+2 from last month",
            className: "text-blue-500" 
          },
          { 
            icon: FolderOpen, 
            title: "Portfolio Views", 
            value: "158", 
            change: "+23% from last month",
            className: "text-green-500" 
          },
          { 
            icon: MessageSquare, 
            title: "Messages", 
            value: "5", 
            change: "2 unread",
            className: "text-purple-500" 
          },
          { 
            icon: Users, 
            title: "Collaborations", 
            value: "2", 
            change: "1 pending review",
            className: "text-orange-500" 
          }
        ].map(({ icon: Icon, title, value, change, className }) => (
          <Card key={title} className="hover:shadow-sm transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className={cn("h-4 w-4", className)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-foreground">{value}</div>
              <p className="text-xs text-muted-foreground">{change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Recent Opportunities</CardTitle>
            <CardDescription>Latest opportunities that match your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Instagram Story Campaign", brand: "Fitness Brand", price: "$500-750", tag: "New", tagStyle: "bg-green-100 text-green-800" },
                { title: "YouTube Product Review", brand: "Tech Company", price: "$1000-1500", tag: "Perfect Match", tagStyle: "bg-blue-100 text-blue-800" },
                { title: "Podcast Guest Appearance", brand: "Media Company", price: "$300", tag: "3d ago", tagStyle: "bg-gray-100 text-gray-800" }
              ].map(({ title, brand, price, tag, tagStyle }) => (
                <div key={title} className="flex justify-between items-center p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">{brand} • {price}</p>
                  </div>
                  <span className={`text-xs ${tagStyle} px-2 py-1 rounded-full`}>{tag}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Featured Portfolio</CardTitle>
            <CardDescription>Your most viewed content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Summer Collection Showcase", type: "Video", views: "87" },
                { title: "Product Review: Tech Gadget", type: "Blog", views: "42" }
              ].map(({ title, type, views }) => (
                <div key={title} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="bg-accent/30 w-16 h-16 rounded flex items-center justify-center">
                    <FolderOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{title}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>{type}</span>
                      <span>•</span>
                      <span>{views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreatorOverview;

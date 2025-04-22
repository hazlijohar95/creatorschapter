import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function SocialMediaProfile() {
  return (
    <div className="space-y-6 pb-12">  {/* Added pb-12 for extra bottom padding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="instagram" className="text-sm font-medium">Instagram</label>
              <Input id="instagram" placeholder="Your Instagram profile URL" />
            </div>
            <div className="space-y-2">
              <label htmlFor="twitter" className="text-sm font-medium">Twitter</label>
              <Input id="twitter" placeholder="Your Twitter profile URL" />
            </div>
            <div className="space-y-2">
              <label htmlFor="youtube" className="text-sm font-medium">YouTube</label>
              <Input id="youtube" placeholder="Your YouTube channel URL" />
            </div>
            <div className="space-y-2">
              <label htmlFor="tiktok" className="text-sm font-medium">TikTok</label>
              <Input id="tiktok" placeholder="Your TikTok profile URL" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">Country</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  {/* Add more countries as needed */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">City</label>
              <Input id="city" placeholder="Your city" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Target Audience Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Age Group</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="13-17">13-17</SelectItem>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45+">45+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="interests" className="text-sm font-medium">Interests</label>
              <Input id="interests" placeholder="e.g., fitness, travel, tech" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { User, X } from "lucide-react";

interface ProfileCompletionProps {
  missingFields: string[];
  onComplete: () => void;
  onSkip: () => void;
}

export function ProfileCompletion({ missingFields, onComplete, onSkip }: ProfileCompletionProps) {
  const { user, profile, refreshProfile } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    bio: profile?.bio || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username.trim(),
          full_name: formData.full_name.trim(),
          bio: formData.bio.trim() || null
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved."
      });

      // Refresh profile data
      await refreshProfile();
      onComplete();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Complete Your Profile</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-slate-600">
            Help us personalize your experience by completing your profile.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {missingFields.includes('username') && (
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="your-username"
                  required
                />
              </div>
            )}

            {missingFields.includes('full_name') && (
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Your Full Name"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us a bit about yourself..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : "Save Profile"}
              </Button>
              <Button type="button" variant="outline" onClick={onSkip}>
                Skip for now
              </Button>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-500">Missing:</span>
              {missingFields.map(field => (
                <Badge key={field} variant="outline" className="text-xs">
                  {field.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
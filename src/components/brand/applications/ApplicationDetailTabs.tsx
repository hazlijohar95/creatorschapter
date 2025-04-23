
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, MessageSquare } from "lucide-react";

interface Props {
  activeTab: string;
  setActiveTab: (t: string) => void;
  application: {
    id: number;
    campaign: string;
    budget: string;
    date: string;
    message: string;
    audienceSize?: string;
    engagement?: string;
    match: number;
    notes?: string[];
  };
  onAddNote: (id: number, note: string) => void;
}

export function ApplicationDetailTabs({
  activeTab,
  setActiveTab,
  application,
  onAddNote
}: Props) {
  // State for adding notes and messaging inside this component
  const [newNote, setNewNote] = useState("");
  const [messageText, setMessageText] = useState("");

  // Calculate match color based on score
  let matchColor = "bg-orange-500";
  if (application.match >= 90) matchColor = "bg-green-500";
  else if (application.match >= 80) matchColor = "bg-blue-500";
  else if (application.match >= 70) matchColor = "bg-yellow-500";
  
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onAddNote(application.id, newNote);
    setNewNote("");
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    // In a real application, this would send the message to the creator
    console.log(`Message sent to creator: ${messageText}`);
    setMessageText("");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="message">Message</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Campaign</h3>
          <p className="text-sm">{application.campaign} • {application.budget}</p>
          <h3 className="text-sm font-medium text-muted-foreground">Application Date</h3>
          <p className="text-sm">{application.date}</p>
          <h3 className="text-sm font-medium text-muted-foreground">Application Message</h3>
          <div className="bg-muted/30 p-3 rounded-md text-sm">
            <p>{application.message}</p>
          </div>
          <Separator />
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Creator Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-xs text-muted-foreground">Audience Size</p>
                <p className="text-lg font-semibold">{application.audienceSize || "N/A"}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-xs text-muted-foreground">Engagement Rate</p>
                <p className="text-lg font-semibold">{application.engagement || "N/A"}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Match score</span>
              <span className="font-bold">{application.match}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${matchColor}`} 
                style={{ width: `${application.match}%` }} 
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <ExternalLink className="mr-1 h-4 w-4" /> View Full Profile
          </Button>
          <Button
            size="sm"
            variant="default"
            className="flex-1"
            onClick={() => setActiveTab("message")}
          >
            <MessageSquare className="mr-1 h-4 w-4" /> Message Creator
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="notes" className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Internal Notes</h3>
          <div className="space-y-3">
            {application.notes && application.notes.length > 0 ? (
              application.notes.map((note, i) => (
                <Card key={i}>
                  <CardContent className="pt-4">
                    <p className="text-sm">{note}</p>
                    <p className="text-xs text-muted-foreground mt-2">Added by Team Member • 2h ago</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No notes yet</p>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Add Note</h3>
          <Textarea
            placeholder="Add internal note about this application..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleAddNote} 
            disabled={!newNote.trim()} 
            className="w-full"
          >
            Add Note
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="message" className="space-y-4">
        <div className="border rounded-md p-4 bg-muted/20 space-y-2 mb-4">
          <h3 className="text-sm font-medium">Message Thread</h3>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start the conversation by sending a message below</p>
          </div>
        </div>
        <div className="space-y-2">
          <Textarea
            placeholder="Type your message to the creator..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!messageText.trim()}
            className="w-full"
          >
            Send Message
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}

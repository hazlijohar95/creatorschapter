
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, MessageSquare, ExternalLink } from "lucide-react";
import { ApplicationStatusBadge } from "../ApplicationStatusBadge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Application {
  id: number;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  campaign: string;
  date: string;
  status: "pending" | "approved" | "rejected" | "in_discussion";
  message: string;
  categories: string[];
  match: number;
  isNew: boolean;
  budget: string;
  audienceSize?: string;
  engagement?: string;
  notes?: string[];
}

interface ApplicationDetailPanelProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDiscuss: (id: number) => void;
  onAddNote: (id: number, note: string) => void;
}

export function ApplicationDetailPanel({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onDiscuss,
  onAddNote
}: ApplicationDetailPanelProps) {
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [messageText, setMessageText] = useState("");

  if (!application) return null;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onAddNote(application.id, newNote);
    setNewNote("");
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    // In a real application, this would send the message to the creator
    console.log(`Message sent to ${application.creatorName}: ${messageText}`);
    setMessageText("");
  };

  // Calculate match color based on score
  let matchColor = "bg-orange-500";
  if (application.match >= 90) matchColor = "bg-green-500";
  else if (application.match >= 80) matchColor = "bg-blue-500";
  else if (application.match >= 70) matchColor = "bg-yellow-500";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-3 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={application.avatar} />
                <AvatarFallback>{application.creatorName.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-lg font-space">{application.creatorName}</SheetTitle>
                <SheetDescription>{application.creatorHandle}</SheetDescription>
              </div>
            </div>
            <ApplicationStatusBadge status={application.status} />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {application.categories.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-secondary/90 font-medium">
                {tag}
              </Badge>
            ))}
          </div>
        </SheetHeader>

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

        <SheetFooter className="pt-4 border-t mt-6 flex flex-col sm:flex-row gap-2">
          {application.status === "pending" && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300"
                onClick={() => {
                  onReject(application.id);
                  onClose();
                }}
              >
                <X className="mr-1 h-4 w-4" /> Reject
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300"
                onClick={() => {
                  onDiscuss(application.id);
                  onClose();
                }}
              >
                <MessageSquare className="mr-1 h-4 w-4" /> Move to Discussion
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-300"
                onClick={() => {
                  onApprove(application.id);
                  onClose();
                }}
              >
                <Check className="mr-1 h-4 w-4" /> Approve
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

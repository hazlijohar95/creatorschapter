
import { useState } from "react";
import { Search, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data
const CONVERSATIONS = [
  {
    id: 1,
    creatorName: "Alex Johnson",
    creatorHandle: "@alexcreates",
    avatar: "",
    lastMessage: "When do you need the content by?",
    timestamp: "10:25 AM",
    unread: true,
  },
  {
    id: 2,
    creatorName: "Jamie Smith",
    creatorHandle: "@jamiesmith",
    avatar: "",
    lastMessage: "I'll send you the draft tomorrow",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    creatorName: "Taylor Wilson",
    creatorHandle: "@taylorwilson",
    avatar: "",
    lastMessage: "Thanks for the opportunity!",
    timestamp: "May 20",
    unread: false,
  },
];

const MESSAGES = [
  {
    id: 1,
    senderId: "brand",
    text: "Hi Alex! Thanks for joining our Summer Collection campaign.",
    timestamp: "10:15 AM",
  },
  {
    id: 2,
    senderId: "creator",
    text: "Thank you for the opportunity! I'm excited to work with your brand.",
    timestamp: "10:18 AM",
  },
  {
    id: 3,
    senderId: "brand",
    text: "Great! I'll send you the product details and requirements shortly.",
    timestamp: "10:20 AM",
  },
  {
    id: 4,
    senderId: "creator",
    text: "When do you need the content by?",
    timestamp: "10:25 AM",
  },
];

export function BrandMessaging() {
  const [activeConversation, setActiveConversation] = useState(1);
  const [messageInput, setMessageInput] = useState("");

  // For consistent theme use, Tailwind colors are used for dark/light.
  // Brand (sent) = primary color; Creator (received) = soft accent.

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="flex h-full">
        {/* Conversation list */}
        <div className="w-full md:w-80 border-r border-border bg-card/60 backdrop-blur-lg flex flex-col">
          <div className="p-4 border-b border-muted">
            <h1 className="text-xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Messages
            </h1>
          </div>
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-8" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {CONVERSATIONS.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 cursor-pointer hover:bg-accent/60 transition-colors rounded-xl mb-1 ${
                  activeConversation === conversation.id
                    ? "bg-gradient-to-r from-muted to-accent/60"
                    : ""
                }`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>
                        {conversation.creatorName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.unread && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary ring-2 ring-card"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium truncate">{conversation.creatorName}</span>
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Message thread */}
        <div className="hidden md:flex flex-col flex-1 h-full bg-gradient-to-br from-background via-card to-muted/70 backdrop-blur-lg px-0 py-0">
          {/* Header */}
          <div className="flex items-center p-4 border-b border-muted bg-card rounded-t-2xl">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src="" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-base text-foreground">
                Alex Johnson
              </h2>
              <p className="text-xs text-muted-foreground">@alexcreates</p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-5">
            <div className="space-y-4">
              {MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`w-full flex ${
                    message.senderId === "brand"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-5 py-3 rounded-2xl text-[15px] shadow-lg
                    ${
                      message.senderId === "brand"
                        ? "bg-gradient-to-br from-primary to-purple-600 text-white border border-primary/20"
                        : "bg-muted/90 text-foreground border border-muted/30"
                    }
                    `}
                  >
                    <p className="break-words">{message.text}</p>
                    <p
                      className={`text-xs mt-2 opacity-70 ${
                        message.senderId === "brand"
                          ? "text-white/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-muted bg-card rounded-b-2xl">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setMessageInput("");
              }}
            >
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 text-base"
                autoComplete="off"
              />
              <Button type="submit" className="bg-primary text-white shadow">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Empty state for mobile */}
        <div className="flex-1 flex items-center justify-center md:hidden bg-background/60">
          <div className="text-center p-8">
            <h3 className="font-semibold text-lg">Select a conversation</h3>
            <p className="text-muted-foreground text-sm">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


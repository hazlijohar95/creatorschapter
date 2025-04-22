import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data (to be replaced with actual data fetching)
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

interface MessageThreadProps {
  conversationId: number;
}

export function MessageThread({ conversationId }: MessageThreadProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center p-4 border-b border-white/10 bg-black/50">
        <Avatar className="mr-3">
          <AvatarImage src="" />
          <AvatarFallback className="bg-white/10 text-white">AJ</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-base text-white">Alex Johnson</h2>
          <p className="text-xs text-white/50">@alexcreates</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {MESSAGES.map((message) => (
            <div
              key={message.id}
              className={`w-full flex ${
                message.senderId === "brand" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-xl text-[15px] 
                  ${
                    message.senderId === "brand"
                      ? "bg-yellow-500/10 text-white border border-yellow-500/20"
                      : "bg-white/5 text-white border border-white/10"
                  }`}
              >
                <p className="break-words">{message.text}</p>
                <p
                  className={`text-xs mt-2 opacity-70 
                    ${
                      message.senderId === "brand"
                        ? "text-yellow-500/70"
                        : "text-white/50"
                    }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}


import { Application } from "../types/applications";

export const APPLICATIONS: Application[] = [
  {
    id: "1",
    creatorName: "Alex Johnson",
    creatorHandle: "@alexcreates",
    avatar: "",
    campaign: "Summer Collection Launch",
    date: "May 25, 2025",
    status: "pending",
    message: "I love your brand and would be excited to collaborate on the summer collection. My audience loves fashion content and I've had great engagement with similar products in the past. I can create both static posts and reels featuring your items styled in different ways.",
    categories: ["Fashion", "Summer", "Instagram"],
    match: 95,
    isNew: true,
    budget: "$1500-2000",
    audienceSize: "120K",
    engagement: "3.8%",
    notes: ["Good fit for summer collection", "Previous fashion experience noted"]
  },
  {
    id: "2",
    creatorName: "Jamie Smith",
    creatorHandle: "@jamiesmith",
    avatar: "",
    campaign: "Fall Product Line",
    date: "May 23, 2025",
    status: "approved",
    message: "I've been a fan of your products for years and would love to showcase them to my followers. My audience is primarily interested in sustainable fashion and lifestyle content, which aligns perfectly with your brand values. I could create a series of posts showing how versatile your fall collection is.",
    categories: ["Fashion", "Review"],
    match: 88,
    isNew: false,
    budget: "$800-1200",
    audienceSize: "85K",
    engagement: "4.2%"
  },
  {
    id: "3",
    creatorName: "Taylor Wilson",
    creatorHandle: "@taylorwilson",
    avatar: "",
    campaign: "Summer Collection Launch",
    date: "May 20, 2025",
    status: "rejected",
    message: "Your summer collection would be a perfect fit for my content calendar. I have some great ideas to showcase these pieces in my upcoming travel series. I can highlight how versatile they are for different occasions and locations. My audience is very responsive to lifestyle and travel content.",
    categories: ["Lifestyle", "Instagram", "Stories"],
    match: 75,
    isNew: false,
    budget: "$700",
    audienceSize: "50K",
    engagement: "2.9%"
  },
  {
    id: "4",
    creatorName: "Morgan Lee",
    creatorHandle: "@morganlee",
    avatar: "",
    campaign: "Winter Essentials",
    date: "May 22, 2025",
    status: "in_discussion",
    message: "I'd love to collaborate on your winter essentials campaign. My audience is primarily in colder climates and always looks forward to my winter fashion recommendations. I can create both indoor and outdoor content showcasing how your items perform in real winter conditions.",
    categories: ["Fashion", "Winter", "Lifestyle"],
    match: 92,
    isNew: true,
    budget: "$1000-1500",
    audienceSize: "95K",
    engagement: "3.5%",
    notes: ["Strong winter content history", "Audience demographics match target"]
  }
];

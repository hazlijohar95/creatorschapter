
import { Application, Opportunity } from "../types/opportunity";

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "1",
    title: "Instagram Story Campaign",
    company: "Fitness Brand",
    budget: "$500-750",
    description: "Looking for fitness influencers to create Instagram Stories highlighting our new protein shakes. Must have an audience interested in fitness and nutrition.",
    match: 95,
    tags: ["Instagram", "Stories", "Fitness"],
    deadline: "2025-05-15",
    isNew: true,
    createdAt: "2025-04-20T10:30:00Z",
  },
  {
    id: "2",
    title: "YouTube Product Review",
    company: "Tech Company",
    budget: "$1000-1500",
    description: "We're seeking tech reviewers to create an in-depth review of our latest smartphone. Must have experience reviewing tech products and a sizable YouTube audience.",
    match: 88,
    tags: ["YouTube", "Tech", "Review"],
    deadline: "2025-05-20",
    isNew: true,
    createdAt: "2025-04-19T15:45:00Z",
  },
  {
    id: "3",
    title: "Podcast Guest Appearance",
    company: "Media Company",
    budget: "$300",
    description: "Join our podcast as a guest to discuss content creation strategies. Looking for experienced creators with unique perspectives.",
    match: 75,
    tags: ["Podcast", "Guest", "Content Strategy"],
    deadline: "2025-05-25",
    isNew: false,
    createdAt: "2025-04-15T09:20:00Z",
  },
  {
    id: "4",
    title: "Blog Post Collaboration",
    company: "Lifestyle Brand",
    budget: "$200-400",
    description: "Write an insightful blog post about sustainable living. Audience should be interested in eco-friendly lifestyle choices.",
    match: 70,
    tags: ["Blog", "Sustainability", "Lifestyle"],
    deadline: "2025-05-30",
    isNew: false,
    createdAt: "2025-04-10T14:15:00Z",
  },
  {
    id: "5",
    title: "TikTok Dance Challenge",
    company: "Music Label",
    budget: "$800-1200",
    description: "Create a viral dance challenge for our upcoming song release. Looking for creators with a strong presence in dance and music content.",
    match: 92,
    tags: ["TikTok", "Dance", "Music"],
    deadline: "2025-05-10",
    isNew: true,
    createdAt: "2025-04-22T11:30:00Z",
  },
  {
    id: "6",
    title: "Beauty Product Review Series",
    company: "Cosmetics Brand",
    budget: "$600-900",
    description: "Create a series of reviews featuring our new skincare line. Ideal for beauty influencers with a focus on skincare routines.",
    match: 83,
    tags: ["Beauty", "Skincare", "Review"],
    deadline: "2025-06-05",
    isNew: false,
    createdAt: "2025-04-08T16:45:00Z",
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "app1",
    opportunity: {
      id: "2",
      title: "YouTube Product Review",
      company: "Tech Company",
      budget: "$1000-1500",
    },
    status: "pending",
    appliedDate: "April 21, 2025",
    lastUpdateDate: "April 21, 2025",
    message: "I've been reviewing tech products for over 3 years and would love to collaborate on this opportunity. My audience is very engaged with tech content.",
  },
  {
    id: "app2",
    opportunity: {
      id: "5",
      title: "TikTok Dance Challenge",
      company: "Music Label",
      budget: "$800-1200",
    },
    status: "approved",
    appliedDate: "April 18, 2025",
    lastUpdateDate: "April 19, 2025",
    message: "I'm a dance content creator with over 100K followers on TikTok. I'd love to create a dance challenge for your upcoming song release!",
    brandResponse: "We're excited to work with you! Let's discuss the details soon."
  }
];

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  Send,
  FileText,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface Campaign {
  id: string;
  title: string;
  brand: string;
  budget: string;
  description: string;
  requirements: string[];
  deadline: string;
  category: string;
  status: 'active' | 'filled' | 'expired';
}

interface Creator {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  engagementRate: number;
  categories: string[];
  portfolio: string[];
  rating: number;
  responseTime: string;
}

interface ApplicationData {
  proposal: string;
  timeline: string;
  budget: string;
  portfolioLinks: string[];
}

export function CampaignCard({ campaign, onApply }: { campaign: Campaign; onApply: () => void }) {
  const statusColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    filled: "bg-orange-100 text-orange-800 border-orange-200", 
    expired: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm overflow-hidden">
        {/* Header with gradient */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {campaign.title}
              </CardTitle>
              <p className="text-slate-600 mt-1">{campaign.brand}</p>
            </div>
            <Badge className={statusColors[campaign.status]}>
              {campaign.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-slate-700 leading-relaxed">{campaign.description}</p>

          {/* Requirements */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Requirements
            </h4>
            <div className="space-y-2">
              {campaign.requirements.map((req, index) => (
                <div key={index} className="flex items-center text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3" />
                  {req}
                </div>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm text-slate-600">Budget:</span>
              <span className="font-semibold text-slate-800">{campaign.budget}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-slate-600">Deadline:</span>
              <span className="font-semibold text-slate-800">{campaign.deadline}</span>
            </div>
          </div>

          {/* Action Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={onApply}
              disabled={campaign.status !== 'active'}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {campaign.status === 'active' ? 'Apply Now' : 'Campaign Closed'}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CreatorCard({ creator, onContact }: { creator: Creator; onContact: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6">
          {/* Creator Profile */}
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                {creator.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                {creator.name}
              </h3>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">{creator.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{creator.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Engagement Rate</span>
                <span className="font-medium">{creator.engagementRate}%</span>
              </div>
              <Progress value={creator.engagementRate} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Response Time</span>
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Clock className="w-3 h-3 mr-1" />
                {creator.responseTime}
              </Badge>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Specializes in</h4>
            <div className="flex flex-wrap gap-2">
              {creator.categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={onContact}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Creator
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ApplicationModal({ 
  campaign, 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationData) => void;
}) {
  const [formData, setFormData] = useState<ApplicationData>({
    proposal: '',
    timeline: '',
    budget: '',
    portfolioLinks: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:h-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h2 className="text-2xl font-bold">Apply to {campaign.title}</h2>
                <p className="text-blue-100 mt-1">{campaign.brand}</p>
              </div>

              {/* Form Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Proposal
                    </label>
                    <Textarea
                      value={formData.proposal}
                      onChange={(e) => setFormData(prev => ({ ...prev, proposal: e.target.value }))}
                      placeholder="Describe your creative approach and why you're perfect for this campaign..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Timeline
                      </label>
                      <Input
                        value={formData.timeline}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                        placeholder="e.g., 2 weeks"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        Your Rate
                      </label>
                      <Input
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        placeholder="e.g., $2,500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Camera className="w-4 h-4 inline mr-2" />
                      Portfolio Links
                    </label>
                    <Textarea
                      value={formData.portfolioLinks.join('\n')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        portfolioLinks: e.target.value.split('\n').filter(link => link.trim()) 
                      }))}
                      placeholder="Paste relevant portfolio links (one per line)..."
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
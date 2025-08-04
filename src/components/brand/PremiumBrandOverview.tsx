import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  BarChart, 
  Plus,
  TrendingUp,
  Clock,
  Award,
  ArrowUpRight,
  Target
} from "lucide-react";
import { useBrandDashboard } from "@/hooks/brand";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { PremiumCard } from "@/components/premium/PremiumCard";
import { PremiumDashboardLayout } from "@/components/premium/PremiumDashboardLayout";
import { AnimatedStats } from "@/components/premium/AnimatedStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export function PremiumBrandOverview() {
  const { stats, recentApplications, upcomingDeadlines, isLoading } = useBrandDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <PremiumDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading your brand dashboard..." />
        </div>
      </PremiumDashboardLayout>
    );
  }

  const handleCreateCampaign = () => {
    navigate("/brand-dashboard/campaigns");
  };

  const handleViewApplications = () => {
    navigate("/brand-dashboard/applications");
  };

  if (!stats) {
    return (
      <PremiumDashboardLayout>
        <EmptyState
          icon={<Target className="w-12 h-12 text-muted-foreground" />}
          title="Welcome to your brand dashboard"
          description="Start by creating your first campaign to connect with talented creators"
          action={{ label: "Create Campaign", onClick: handleCreateCampaign }}
        />
      </PremiumDashboardLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PremiumDashboardLayout>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Brand Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Brand Command Center
            </h1>
            <p className="text-slate-600 mt-2">
              Manage campaigns, discover creators, and track your brand's growth
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={() => navigate('/brand-dashboard/creators')}
              className="hover:bg-purple-50 hover:border-purple-200"
            >
              <Users className="w-4 h-4 mr-2" />
              Find Creators
            </Button>
            <Button 
              onClick={handleCreateCampaign}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <PremiumCard
            title="Active Campaigns"
            value={<AnimatedStats value={stats.activeCampaigns} />}
            description="Running campaigns"
            icon={Calendar}
            trend="up"
            trendValue="+15%"
            gradient="from-purple-500/20 to-indigo-500/20"
            onClick={() => navigate('/brand-dashboard/campaigns')}
          />
          
          <PremiumCard
            title="Creator Applications"
            value={<AnimatedStats value={stats.creatorApplications} />}
            description="Pending review"
            icon={Clock}
            trend="up"
            trendValue="+32%"
            gradient="from-blue-500/20 to-cyan-500/20"
            onClick={handleViewApplications}
          />
          
          <PremiumCard
            title="Active Collaborations"
            value={<AnimatedStats value={stats.activeCollaborations} />}
            description="Ongoing partnerships"
            icon={CheckCircle}
            trend="up"
            trendValue="+8%"
            gradient="from-emerald-500/20 to-teal-500/20"
            onClick={() => navigate('/brand-dashboard/collaborations')}
          />
          
          <PremiumCard
            title="Content Delivered"
            value={<AnimatedStats value={stats.contentDelivered} />}
            description="This month"
            icon={Award}
            trend="up"
            trendValue="+28%"
            gradient="from-orange-500/20 to-red-500/20"
            onClick={() => navigate('/brand-dashboard/analytics')}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications - Takes 2 columns */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-slate-800 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                      Latest Applications
                    </CardTitle>
                    <p className="text-slate-600 mt-1">Creators interested in your campaigns</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleViewApplications}
                    className="hover:bg-purple-50 hover:border-purple-200"
                  >
                    Review All
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications && recentApplications.length > 0 ? (
                    recentApplications.map((application, index) => (
                      <motion.div
                        key={application.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-4 rounded-xl border border-white/40 bg-gradient-to-r from-white/50 to-white/30 hover:from-white/70 hover:to-white/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1"
                        onClick={() => navigate(`/brand-dashboard/applications/${application.id}`)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">
                                {application.creatorName}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-slate-600">{application.campaignName}</span>
                                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                <span className="text-sm text-slate-500">{application.appliedAt}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="secondary" 
                              className="bg-purple-100 text-purple-700 border-0 font-medium"
                            >
                              {application.status}
                            </Badge>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < application.matchScore ? 'text-yellow-400' : 'text-gray-300'}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">No applications yet</p>
                      <Button 
                        onClick={handleCreateCampaign}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      >
                        Create Your First Campaign
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Campaign Performance & Quick Actions */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Campaign Performance */}
            <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                  <BarChart className="w-5 h-5 mr-2 text-emerald-500" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Campaign Reach</span>
                    <span className="text-lg font-bold text-slate-800">
                      <AnimatedStats value={145000} suffix="K" />
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Engagement Rate</span>
                    <span className="text-lg font-bold text-slate-800">
                      <AnimatedStats value={4.2} suffix="%" />
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">ROI</span>
                    <span className="text-lg font-bold text-slate-800">
                      <AnimatedStats value={320} suffix="%" />
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-200"
                    onClick={() => navigate('/brand-dashboard/creators')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Discover Creators
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => navigate('/brand-dashboard/campaigns')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Manage Campaigns
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-emerald-50 hover:border-emerald-200"
                    onClick={() => navigate('/brand-dashboard/analytics')}
                  >
                    <BarChart className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            {upcomingDeadlines && upcomingDeadlines.length > 0 && (
              <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-500" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingDeadlines.slice(0, 3).map((deadline, index) => (
                      <motion.div
                        key={deadline.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100"
                      >
                        <div>
                          <p className="font-medium text-slate-800">{deadline.title}</p>
                          <p className="text-sm text-slate-600">{deadline.date}</p>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          {deadline.daysLeft}d left
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </motion.div>
    </PremiumDashboardLayout>
  );
}
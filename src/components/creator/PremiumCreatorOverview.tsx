import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FolderOpen, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Calendar,
  Star,
  ArrowUpRight
} from "lucide-react";
import { useCreatorDashboard } from "@/hooks/useCreatorDashboard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { PremiumCard } from "@/components/premium/PremiumCard";
import { PremiumDashboardLayout } from "@/components/premium/PremiumDashboardLayout";
import { AnimatedStats, AnimatedProgress } from "@/components/premium/AnimatedStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreatorDashboardHeader } from "./CreatorDashboardHeader";
import { useNavigate } from "react-router-dom";

export function PremiumCreatorOverview() {
  const { stats, recentOpportunities, featuredPortfolio, isLoading } = useCreatorDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <PremiumDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading your dashboard..." />
        </div>
      </PremiumDashboardLayout>
    );
  }

  if (!stats) {
    return (
      <PremiumDashboardLayout>
        <EmptyState
          icon={<Search className="w-12 h-12 text-muted-foreground" />}
          title="No dashboard data available"
          description="We couldn't retrieve your dashboard data. Please try again later."
          action={{ label: "Refresh", onClick: () => window.location.reload() }}
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
        {/* Profile completion prompt for existing users */}
        <CreatorDashboardHeader />
        
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, Creator
            </h1>
            <p className="text-slate-600 mt-2">
              Here's what's happening with your creative journey today
            </p>
          </div>
          <Button 
            onClick={() => navigate('/creator-dashboard/opportunities')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Search className="w-4 h-4 mr-2" />
            Find Opportunities
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <PremiumCard
            title="Active Opportunities"
            value={<AnimatedStats value={stats.activeOpportunities} />}
            description={stats.changeData.opportunitiesChange}
            icon={Search}
            trend="up"
            trendValue="+12%"
            gradient="from-blue-500/20 to-cyan-500/20"
            onClick={() => navigate('/creator-dashboard/opportunities')}
          />
          
          <PremiumCard
            title="Portfolio Views"
            value={<AnimatedStats value={stats.portfolioViews} />}
            description={stats.changeData.viewsChange}
            icon={FolderOpen}
            trend="up"
            trendValue="+23%"
            gradient="from-emerald-500/20 to-teal-500/20"
            onClick={() => navigate('/creator-dashboard/portfolio')}
          />
          
          <PremiumCard
            title="Unread Messages"
            value={<AnimatedStats value={stats.unreadMessages} />}
            description={`${stats.changeData.messagesUnread} new today`}
            icon={MessageSquare}
            trend="neutral"
            gradient="from-purple-500/20 to-pink-500/20"
            onClick={() => navigate('/creator-dashboard/collaborations')}
          />
          
          <PremiumCard
            title="Active Collaborations"
            value={<AnimatedStats value={stats.activeCollaborations} />}
            description={`${stats.changeData.pendingReviews} pending review`}
            icon={Users}
            trend="up"
            trendValue="+8%"
            gradient="from-orange-500/20 to-red-500/20"
            onClick={() => navigate('/creator-dashboard/collaborations')}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Opportunities - Takes 2 columns */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-slate-800 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Hot Opportunities
                    </CardTitle>
                    <p className="text-slate-600 mt-1">Perfectly matched to your profile</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/creator-dashboard/opportunities')}
                    className="hover:bg-blue-50 hover:border-blue-200"
                  >
                    View All
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOpportunities && recentOpportunities.length > 0 ? (
                    recentOpportunities.map(({ id, title, brand, price, tag, tagStyle }, index) => (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-4 rounded-xl border border-white/40 bg-gradient-to-r from-white/50 to-white/30 hover:from-white/70 hover:to-white/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1"
                        onClick={() => navigate(`/creator-dashboard/opportunities/${id}`)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-sm text-slate-600">{brand}</span>
                              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                              <span className="text-sm font-medium text-slate-800">{price}</span>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`${tagStyle} border-0 font-medium`}
                          >
                            {tag}
                          </Badge>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">No opportunities available yet</p>
                      <Button 
                        onClick={() => navigate('/creator-dashboard/opportunities')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      >
                        Browse Opportunities
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Portfolio & Quick Actions */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Featured Portfolio */}
            <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Top Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredPortfolio && featuredPortfolio.length > 0 ? (
                    featuredPortfolio.map(({ id, title, type, views }, index) => (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-white hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer group"
                        onClick={() => navigate('/creator-dashboard/portfolio')}
                      >
                        <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <FolderOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                            {title}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <span>{type}</span>
                            <span>•</span>
                            <span><AnimatedStats value={views} /> views</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 mb-3">No portfolio items yet</p>
                      <Button 
                        size="sm"
                        onClick={() => navigate('/creator-dashboard/portfolio')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      >
                        Add First Item
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-emerald-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => navigate('/creator-dashboard/opportunities')}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Browse Opportunities
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-emerald-50 hover:border-emerald-200"
                    onClick={() => navigate('/creator-dashboard/portfolio')}
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Update Portfolio
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-200"
                    onClick={() => navigate('/creator-dashboard/collaborations')}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Check Messages
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PremiumDashboardLayout>
  );
}
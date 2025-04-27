
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './integrations/supabase/client';
import { useAuthStore } from './lib/auth';
import Index from './pages/Index';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import './App.css';
import LoadingOverlay from './components/LoadingOverlay';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CreatorOnboarding from "./pages/CreatorOnboarding";
import CreatorDashboard from "./pages/CreatorDashboard";
import BrandDashboard from "./pages/BrandDashboard";
import BrandOnboarding from "./pages/BrandOnboarding";
import { CreatorOverview } from "./components/creator/CreatorOverview";
import { BrandOverview } from "./components/brand/BrandOverview";
import { CreatorDiscovery } from "./components/brand/CreatorDiscovery";
import { CampaignManagement } from "./components/brand/CampaignManagement";
import { ApplicationReview } from "./components/brand/ApplicationReview";
import { BrandMessaging } from "./components/brand/BrandMessaging";
import { BrandSettings } from "./components/brand/BrandSettings";
import { Toaster } from "./components/ui/toaster";
import OpportunityDiscovery from "./components/dashboard/OpportunityDiscovery";
import PortfolioManagement from "./components/dashboard/PortfolioManagement";
import CollaborationManagement from "./components/dashboard/CollaborationManagement";
import SocialMediaProfile from "./components/dashboard/SocialMediaProfile";
import SettingsPanel from "./components/dashboard/SettingsPanel";

function App() {
  const { setUser, setSession, user } = useAuthStore();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigateEvents = typeof window !== "undefined" && window.addEventListener;

  useEffect(() => {
    if (!navigateEvents) return;

    const handleNavigate = (e: any) => {
      if (window.location.pathname === "/auth") {
        setIsNavigating(true);
      }
    };
    const handleComplete = () => setIsNavigating(false);
    window.addEventListener("popstate", handleNavigate);
    window.addEventListener("pushstate", handleNavigate);
    window.addEventListener("replacestate", handleNavigate);
    window.addEventListener("load", handleComplete);

    return () => {
      window.removeEventListener("popstate", handleNavigate);
      window.removeEventListener("pushstate", handleNavigate);
      window.removeEventListener("replacestate", handleNavigate);
      window.removeEventListener("load", handleComplete);
    };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      {isNavigating && <LoadingOverlay />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/creator-dashboard" element={<CreatorDashboard />}>
            <Route index element={<CreatorOverview />} />
            <Route path="opportunities" element={<OpportunityDiscovery />} />
            <Route path="portfolio" element={<PortfolioManagement />} />
            <Route path="collaborations" element={<CollaborationManagement />} />
            <Route path="social" element={<SocialMediaProfile />} />
            <Route path="settings" element={<SettingsPanel />} />
          </Route>
          
          <Route path="/onboarding" element={<CreatorOnboarding />} />
          <Route path="/brand-onboarding" element={<BrandOnboarding />} />
          
          <Route path="/brand-dashboard" element={<BrandDashboard />}>
            <Route index element={<BrandOverview />} />
            <Route path="discover" element={<CreatorDiscovery />} />
            <Route path="campaigns" element={<CampaignManagement />} />
            <Route path="applications" element={<ApplicationReview />} />
            <Route path="messages" element={<BrandMessaging />} />
            <Route path="settings" element={<BrandSettings />} />
          </Route>
        </Route>
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

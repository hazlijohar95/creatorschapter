
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import { supabase } from './integrations/supabase/client';
import { useAuthStore } from './lib/auth';
import LoadingOverlay from './components/LoadingOverlay';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import './App.css';

// Lazy load page components
const Index = lazy(() => import('./pages/Index'));
const Auth = lazy(() => import('./pages/Auth'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreatorOnboarding = lazy(() => import('./pages/CreatorOnboarding'));
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'));
const BrandDashboard = lazy(() => import('./pages/BrandDashboard'));
const BrandOnboarding = lazy(() => import('./pages/BrandOnboarding'));

// Lazy load creator components
const CreatorOverview = lazy(() => import('./components/creator/CreatorOverview').then(module => ({ default: module.CreatorOverview })));
const OpportunityDiscovery = lazy(() => import('./components/dashboard/OpportunityDiscovery'));
const PortfolioManagement = lazy(() => import('./components/dashboard/PortfolioManagement'));
const CollaborationManagement = lazy(() => import('./components/dashboard/CollaborationManagement'));
const SocialMediaProfile = lazy(() => import('./components/dashboard/SocialMediaProfile'));
const SettingsPanel = lazy(() => import('./components/dashboard/SettingsPanel'));

// Lazy load brand components
const BrandOverview = lazy(() => import('./components/brand/BrandOverview').then(module => ({ default: module.BrandOverview })));
const CreatorDiscovery = lazy(() => import('./components/brand/CreatorDiscovery').then(module => ({ default: module.CreatorDiscovery })));
const CampaignManagement = lazy(() => import('./components/brand/CampaignManagement').then(module => ({ default: module.CampaignManagement })));
const ApplicationReview = lazy(() => import('./components/brand/ApplicationReview').then(module => ({ default: module.ApplicationReview })));
const BrandMessaging = lazy(() => import('./components/brand/BrandMessaging').then(module => ({ default: module.BrandMessaging })));
const BrandSettings = lazy(() => import('./components/brand/BrandSettings').then(module => ({ default: module.BrandSettings })));

// Legal pages
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));

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
      <Suspense fallback={<LoadingOverlay />}>
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
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;

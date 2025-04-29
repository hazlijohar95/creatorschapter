
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import { supabase } from './integrations/supabase/client';
import { useAuthStore } from './lib/auth';
import LoadingOverlay from './components/LoadingOverlay';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { initSupabaseServices } from './lib/initSupabaseServices';
import './App.css';

// Import Auth directly instead of lazy loading to prevent dynamic import issues
import Auth from './pages/Auth';

// Main layouts to be loaded upfront instead of lazy loaded
import Dashboard from './pages/Dashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import BrandDashboard from './pages/BrandDashboard';

// Lazy load other pages with lower priority
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CreatorOnboarding = lazy(() => import('./pages/CreatorOnboarding'));
const BrandOnboarding = lazy(() => import('./pages/BrandOnboarding'));

// Lazy load dashboard components with route-based chunking
const dashboardChunk = {
  creator: {
    Overview: lazy(() => import('./components/creator/CreatorOverview').then(module => ({ default: module.CreatorOverview }))),
    Opportunities: lazy(() => import('./components/dashboard/OpportunityDiscovery')),
    Portfolio: lazy(() => import('./components/dashboard/PortfolioManagement')),
    Collaborations: lazy(() => import('./components/dashboard/CollaborationManagement')),
    Social: lazy(() => import('./components/dashboard/SocialMediaProfile')),
    Settings: lazy(() => import('./components/dashboard/SettingsPanel')),
  },
  brand: {
    Overview: lazy(() => import('./components/brand/BrandOverview').then(module => ({ default: module.BrandOverview }))),
    Creators: lazy(() => import('./components/brand/CreatorDiscovery').then(module => ({ default: module.CreatorDiscovery }))),
    Campaigns: lazy(() => import('./components/brand/CampaignManagement').then(module => ({ default: module.CampaignManagement }))),
    Applications: lazy(() => import('./components/brand/ApplicationReview').then(module => ({ default: module.ApplicationReview }))),
    Messages: lazy(() => import('./components/brand/BrandMessaging').then(module => ({ default: module.BrandMessaging }))),
    Settings: lazy(() => import('./components/brand/BrandSettings').then(module => ({ default: module.BrandSettings }))),
  }
};

// Legal pages
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));

// Fallback components for more granular loading states
const ContentLoadingFallback = () => (
  <div className="h-full w-full flex items-center justify-center p-8">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const { setUser, setSession, user } = useAuthStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    initSupabaseServices();
  }, []);

  // Handle auth state and initial app loading
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsInitialLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession]);

  // Preload most likely next routes based on current route
  useEffect(() => {
    if (!user) return;

    const preloadNextRoutes = async () => {
      // Preload based on current location
      if (location.pathname === '/auth' && user) {
        // When authenticated, preload dashboard
        const module = await import('./pages/Dashboard');
      } else if (location.pathname === '/creator-dashboard') {
        // When on creator dashboard, preload common sections
        const module = await import('./components/dashboard/OpportunityDiscovery');
      } else if (location.pathname === '/brand-dashboard') {
        // When on brand dashboard, preload campaigns
        const module = await import('./components/brand/CampaignManagement');
      }
    };

    preloadNextRoutes();
  }, [location.pathname, user]);

  // Only show full-page loading for initial app load
  if (isInitialLoading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <Suspense fallback={<ContentLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/creator-dashboard" element={<CreatorDashboard />}>
              <Route index element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.creator.Overview />
                </Suspense>
              } />
              <Route path="opportunities" element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.creator.Opportunities />
                </Suspense>
              } />
              <Route path="portfolio" element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.creator.Portfolio />
                </Suspense>
              } />
              <Route path="collaborations" element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.creator.Collaborations />
                </Suspense>
              } />
              <Route path="social" element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.creator.Social />
                </Suspense>
              } />
              <Route path="settings" element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.creator.Settings />
                </Suspense>
              } />
            </Route>
            
            <Route path="/onboarding" element={<CreatorOnboarding />} />
            <Route path="/brand-onboarding" element={<BrandOnboarding />} />
            
            <Route path="/brand-dashboard" element={<BrandDashboard />}>
              <Route index element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.brand.Overview />
                </Suspense>
              } />
              <Route path="creators" element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.brand.Creators />
                </Suspense>
              } />
              <Route path="campaigns" element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.brand.Campaigns />
                </Suspense>
              } />
              <Route path="calendar" element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.brand.Campaigns />
                </Suspense>
              } />
              <Route path="applications" element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.brand.Applications />
                </Suspense>
              } />
              <Route path="messages" element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.brand.Messages />
                </Suspense>
              } />
              <Route path="settings" element={
                <Suspense fallback={<ContentLoadingFallback />}>
                  <dashboardChunk.brand.Settings />
                </Suspense>
              } />
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

import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy, startTransition } from 'react';
import { supabase } from './integrations/supabase/client';
import { useAuthStore } from './lib/auth';
import LoadingOverlay from './components/LoadingOverlay';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { initSupabaseServices } from './lib/initSupabaseServices';
import './App.css';

// Import Auth directly instead of lazy loading to prevent dynamic import issues
import Auth from './pages/Auth';

// Lazy load other page components
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreatorOnboarding = lazy(() => import('./pages/CreatorOnboarding'));
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'));
const BrandDashboard = lazy(() => import('./pages/BrandDashboard'));
const BrandOnboarding = lazy(() => import('./pages/BrandOnboarding'));

// Lazy load creator components with preloading
const CreatorOverview = lazy(() => {
  const module = import('./components/creator/CreatorOverview')
    .then(module => ({ default: module.CreatorOverview }));
  return module;
});

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

// Preload module function
const preloadModule = (importFn: () => Promise<any>) => {
  // Use setTimeout as a safer alternative to startTransition
  setTimeout(() => {
    importFn();
  }, 0);
};

// Preloader component to trigger on hover
export function ModulePreloader({ path }: { path: string }) {
  useEffect(() => {
    // Map paths to lazy components for preloading
    const moduleMap: Record<string, () => Promise<any>> = {
      '/creator-dashboard': () => import('./components/creator/CreatorOverview').then(module => ({ default: module.CreatorOverview })),
      '/creator-dashboard/opportunities': () => import('./components/dashboard/OpportunityDiscovery'),
      '/creator-dashboard/portfolio': () => import('./components/dashboard/PortfolioManagement'),
      '/brand-dashboard': () => import('./components/brand/BrandOverview').then(module => ({ default: module.BrandOverview })),
      // Add other paths as needed
    };
    
    // Preload the module if it exists in our map
    if (moduleMap[path]) {
      preloadModule(moduleMap[path]);
    }
  }, [path]);
  
  return null; // This is just a utility component, doesn't render anything
}

function App() {
  const { setUser, setSession, user } = useAuthStore();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigateEvents = typeof window !== "undefined" && window.addEventListener;
  const location = useLocation();

  useEffect(() => {
    initSupabaseServices();
  }, []);

  useEffect(() => {
    if (!navigateEvents) return;

    const handleNavigate = () => {
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
  }, [navigateEvents]);

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

  // Preload the next likely routes based on current route
  useEffect(() => {
    if (!user) return;
    
    // Only preload after initial authentication to avoid unnecessary loads
    if (location.pathname === '/') {
      // When on landing, preload auth related components
      preloadModule(() => import('./pages/Auth'));
    } else if (location.pathname === '/auth' && user) {
      // When authenticated, preload dashboard
      preloadModule(() => import('./pages/Dashboard'));
    } else if (location.pathname === '/creator-dashboard') {
      // When on creator dashboard, preload common sections
      preloadModule(() => import('./components/dashboard/OpportunityDiscovery'));
    }
  }, [location.pathname, user]);

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

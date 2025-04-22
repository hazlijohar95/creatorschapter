
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const { setUser, setSession } = useAuthStore();
  const [isNavigating, setIsNavigating] = useState(false);
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession]);

  return (
    <>
      {isNavigating && <LoadingOverlay />}
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

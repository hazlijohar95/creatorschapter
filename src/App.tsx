
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Create a new query client instance with retry configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// ScrollToTop component to reset scroll position on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  // Mobile optimizations
  useEffect(() => {
    // Prevent pull-to-refresh on mobile
    const preventPullToRefresh = (e: TouchEvent) => {
      // Prevent only if scrolled to top
      if (document.documentElement.scrollTop === 0) {
        e.preventDefault();
      }
    };

    // Disable double-tap to zoom (without affecting pinch zoom)
    const disableDoubleTapZoom = (e: TouchEvent) => {
      const now = Date.now();
      const timeDiff = now - (e.target as any).__lastTouch || 0;
      if (timeDiff < 300) {
        e.preventDefault();
      }
      (e.target as any).__lastTouch = now;
    };

    // Apply mobile optimizations
    document.addEventListener('touchstart', preventPullToRefresh, { passive: false });
    document.addEventListener('touchend', disableDoubleTapZoom, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', preventPullToRefresh);
      document.removeEventListener('touchend', disableDoubleTapZoom);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

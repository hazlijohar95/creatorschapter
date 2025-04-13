
import React, { useEffect } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorksSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import BrandSection from '../components/BrandSection';
import WaitlistSection from '../components/WaitlistSection';
import Footer from '../components/Footer';

const Index = () => {
  const isMobile = useIsMobile();
  
  // Handle viewport height for mobile
  useEffect(() => {
    console.log("Index page mounted");
    document.title = "DEALFLOW - Get Better Brand Deals Without the Back-and-Forth";
    
    // Handle mobile viewport height issue (iOS Safari)
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    
    // Add specific mobile body class
    if (isMobile) {
      document.body.classList.add('is-mobile');
    } else {
      document.body.classList.remove('is-mobile');
    }
    
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, [isMobile]);
  
  return (
    <div className="min-h-screen bg-darkbg text-white overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <BrandSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

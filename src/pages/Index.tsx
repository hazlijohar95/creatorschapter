
import React, { useEffect, useRef } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorksSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import BrandSection from '../components/BrandSection';
import WaitlistSection from '../components/WaitlistSection';
import Footer from '../components/Footer';

const Index = () => {
  // This will hold refs to sections that should be lazily loaded
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const brandSectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Index page mounted - using proper analytics tracking instead
    document.title = "Creator Chapter - Get Better Brand Deals Without the Back-and-Forth";
    
    // Lazy load sections below the fold
    const lazyLoadSections = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // When section is about to enter viewport, reveal it
          if (entry.isIntersecting) {
            const section = entry.target as HTMLElement;
            section.style.opacity = '1';
            observer.unobserve(section);
          }
        });
      }, { threshold: 0.1, rootMargin: '100px' });
      
      // Observe sections that are below the fold
      if (featuresRef.current) observer.observe(featuresRef.current);
      if (testimonialsRef.current) observer.observe(testimonialsRef.current);
      if (brandSectionRef.current) observer.observe(brandSectionRef.current);
      
      return () => {
        if (featuresRef.current) observer.unobserve(featuresRef.current);
        if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
        if (brandSectionRef.current) observer.unobserve(brandSectionRef.current);
      };
    };
    
    lazyLoadSections();
    
    // Prefetching for faster navigation
    const prefetchAuthPage = () => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/auth';
      document.head.appendChild(link);
    };
    
    // Delay prefetch to not compete with initial page resources
    const prefetchTimer = setTimeout(() => {
      prefetchAuthPage();
    }, 2000);
    
    return () => {
      clearTimeout(prefetchTimer);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-darkbg text-white overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <div ref={featuresRef} style={{ opacity: '0', transition: 'opacity 0.5s ease-in-out' }}>
          <FeaturesSection />
        </div>
        <div ref={testimonialsRef} style={{ opacity: '0', transition: 'opacity 0.5s ease-in-out' }}>
          <TestimonialsSection />
        </div>
        <div ref={brandSectionRef} style={{ opacity: '0', transition: 'opacity 0.5s ease-in-out' }}>
          <BrandSection />
        </div>
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

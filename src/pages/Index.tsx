
import React, { useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorksSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import BrandSection from '../components/BrandSection';
import WaitlistSection from '../components/WaitlistSection';
import Footer from '../components/Footer';

const Index = () => {
  useEffect(() => {
    console.log("Index page mounted");
    document.title = "DEALFLOW - Get Better Brand Deals Without the Back-and-Forth";
  }, []);
  
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

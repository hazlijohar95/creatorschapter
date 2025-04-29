
import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Prefetch the features section when the hero is loaded
  useEffect(() => {
    const prefetchNextSection = () => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = '/lovable-uploads/1a639097-f17e-4568-bc9f-063d6afdde73.png';
      document.head.appendChild(link);
    };
    
    prefetchNextSection();
  }, []);
  
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section className="hero-gradient min-h-screen flex items-center pt-20 section-padding" id="hero">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get Better Brand Deals. Without the Back-and-Forth.
            </h1>
            <h2 className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl leading-relaxed">
              We match creators to the best campaigns using AI, follow up with brands automatically, and help you manage deals — all in one dashboard.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={scrollToWaitlist} className="btn-neon text-lg flex items-center justify-center">
                Join the Waitlist
                <ArrowDown className="ml-2 h-5 w-5" />
              </button>
              <a href="#how-it-works" className="py-3 px-8 text-white border border-white/20 rounded-full hover:bg-white/10 transition-all transform hover:scale-105 duration-300 text-center">
                Learn More
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon/50 to-premiumBlack/50 rounded-xl blur-xl opacity-75"></div>
              <img 
                src="/lovable-uploads/8ccdeef9-35e4-4146-808b-d80bd959b82d.png" 
                alt="Dashboard UI" 
                className={`relative w-full h-auto rounded-xl shadow-2xl border border-glassBorder transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                width="800"
                height="600"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onLoad={handleImageLoad}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

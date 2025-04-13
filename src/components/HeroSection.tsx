
import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-gradient min-h-[100svh] flex items-center pt-20 section-padding" id="hero">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 animate-fade-in">
            <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-bold mb-6 leading-tight`}>
              Get Better Brand Deals. Without the Back-and-Forth.
            </h1>
            <h2 className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl leading-relaxed">
              We match creators to the best campaigns using AI, follow up with brands automatically, and help you manage deals — all in one dashboard.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToWaitlist} 
                className="btn-neon text-lg flex items-center justify-center"
              >
                Join the Waitlist
                <ArrowDown className="ml-2 h-5 w-5" />
              </button>
              <a 
                href="#how-it-works" 
                className="py-3 px-8 text-white border border-white/20 rounded-full hover:bg-white/10 transition-all transform hover:scale-105 duration-300 text-center"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon/50 to-premiumBlack/50 rounded-xl blur-xl opacity-75"></div>
              <img 
                src="/lovable-uploads/8ccdeef9-35e4-4146-808b-d80bd959b82d.png" 
                alt="Dashboard UI" 
                className="relative w-full h-auto rounded-xl shadow-2xl border border-glassBorder"
                loading={isMobile ? "lazy" : "eager"}
                decoding="async"
                width="800"
                height="500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


import React, { useEffect, useRef } from 'react';
import { Bot, LineChart, MousePointerClick, MessageCircle, History, CreditCard } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('feature-visible');
        }
      });
    }, { threshold: 0.1 });
    
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      observer.observe(card);
    });
    
    return () => {
      featureCards.forEach(card => {
        observer.unobserve(card);
      });
    };
  }, []);

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-neon" />,
      title: "AI Deal Matching",
      description: "Our algorithm finds the perfect brand partnerships based on your content and audience."
    },
    {
      icon: <LineChart className="w-8 h-8 text-neon" />,
      title: "Campaign Tracker",
      description: "Monitor all your brand deals in one place with status updates and deadlines."
    },
    {
      icon: <MousePointerClick className="w-8 h-8 text-neon" />,
      title: "1-Click Applications",
      description: "Apply to multiple brand deals with a single click using your saved profile."
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-neon" />,
      title: "Follow-Up Assistant",
      description: "Automated messages to brands ensure you never lose a deal due to slow communication."
    },
    {
      icon: <History className="w-8 h-8 text-neon" />,
      title: "Creator Deal History",
      description: "Track your performance and deal history to negotiate better rates."
    },
    {
      icon: <CreditCard className="w-8 h-8 text-neon" />,
      title: "Payout Support",
      description: "Secure payment processing and tracking coming soon."
    }
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-gradient-to-b from-darkbg to-navygrad/50" id="features">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Features That Empower Creators</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Everything you need to streamline your brand partnerships and maximize your earning potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`glass-card p-8 hover:shadow-lg hover:shadow-neon/10 transition-all duration-300 feature-card opacity-0 transform translate-y-8`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

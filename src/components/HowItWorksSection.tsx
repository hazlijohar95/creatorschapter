
import React from 'react';
import { UserPlus, Zap, Clock } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <UserPlus className="w-10 h-10 text-neon" />,
      title: "Create Your Profile",
      description: "Add your niche, audience stats, and content style to get personalized recommendations."
    },
    {
      icon: <Zap className="w-10 h-10 text-neon" />,
      title: "Get Matched Instantly",
      description: "Our AI finds campaigns that fit your brand and audience perfectly."
    },
    {
      icon: <Clock className="w-10 h-10 text-neon" />,
      title: "We Handle Follow-Ups",
      description: "Automated reminders ensure brands respond to you quickly."
    }
  ];

  return (
    <section className="section-padding bg-darkbg" id="how-it-works">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Get matched with the right brand deals effortlessly through our AI-powered platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="glass-card p-8 hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="rounded-full bg-darkbg/60 p-4 inline-block mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-white/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

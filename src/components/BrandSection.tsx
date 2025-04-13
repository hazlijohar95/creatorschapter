
import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

const BrandSection: React.FC = () => {
  const benefits = [
    "Post campaigns and let AI find your perfect creator matches",
    "Review verified creator profiles with real audience metrics",
    "Manage all your briefs, communications, and deals in one place"
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-navygrad/50 to-darkbg" id="for-brands">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Discover the Right Creators. Without the Guesswork.
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Match your brand with our network of verified creators who already love what you do. 
              No more scrolling through endless profiles or hoping for responses.
            </p>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="rounded-full bg-neon/10 p-1 mt-1 mr-3">
                    <Check className="w-5 h-5 text-neon" />
                  </div>
                  <p className="text-white/80">{benefit}</p>
                </div>
              ))}
            </div>
            
            <a href="#" className="btn-neon flex items-center w-fit">
              <span>Book a Demo</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purplegrad/50 to-neon/50 rounded-xl blur-xl opacity-75"></div>
              <div className="glass-card p-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <h4 className="text-neon mb-2 font-medium">Campaign Manager</h4>
                    <p className="text-sm text-white/70">
                      Create campaigns with detailed parameters and let AI match you with the perfect creators.
                    </p>
                  </div>
                  <div className="glass-card p-6">
                    <h4 className="text-neon mb-2 font-medium">Creator Analytics</h4>
                    <p className="text-sm text-white/70">
                      View verified metrics and previous partnership results for each creator.
                    </p>
                  </div>
                  <div className="glass-card p-6">
                    <h4 className="text-neon mb-2 font-medium">Content Library</h4>
                    <p className="text-sm text-white/70">
                      Store and organize all creator deliverables in one searchable archive.
                    </p>
                  </div>
                  <div className="glass-card p-6">
                    <h4 className="text-neon mb-2 font-medium">ROI Tracking</h4>
                    <p className="text-sm text-white/70">
                      Measure campaign performance with real-time analytics dashboards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;

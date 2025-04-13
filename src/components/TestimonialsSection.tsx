
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      quote: "I landed 2 collabs this month without sending a single DM.",
      name: "@ashraffmoghni",
      role: "Fashion Creator",
      avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=100&auto=format&fit=crop"
    },
    {
      quote: "Feels like having a sponsorship manager, but way cheaper.",
      name: "@rajahakim",
      role: "Fitness Influencer",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
    },
    {
      quote: "The AI matches actually understand my audience and content style.",
      name: "@jessicawilliams",
      role: "Beauty Creator",
      avatar: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=100&auto=format&fit=crop"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding bg-darkbg" id="testimonials">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Creator Success Stories</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            See how creators like you are transforming their brand partnerships.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto px-4">
          <div className="glass-card p-8 md:p-12 relative">
            <div className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3">
              <span className="text-neon text-6xl font-serif">"</span>
            </div>
            
            <div className="mb-8 pt-6">
              <p className="text-xl md:text-2xl italic mb-6">
                {testimonials[currentIndex].quote}
              </p>
              
              <div className="flex items-center">
                <img 
                  src={testimonials[currentIndex].avatar} 
                  alt={testimonials[currentIndex].name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-neon"
                />
                <div className="ml-4">
                  <div className="font-bold text-neon">{testimonials[currentIndex].name}</div>
                  <div className="text-white/70 text-sm">{testimonials[currentIndex].role}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-navygrad border border-glassBorder hover:bg-neon hover:text-darkbg transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-navygrad border border-glassBorder hover:bg-neon hover:text-darkbg transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

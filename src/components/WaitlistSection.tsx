
import React, { useState } from 'react';
import { Check } from 'lucide-react';

const WaitlistSection: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    socialHandle: '',
    followerCount: '',
    niche: '',
    submitted: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically submit to an API endpoint
    console.log("Form submitted:", formState);
    
    // For demo purposes, just set submitted to true
    setFormState(prev => ({ ...prev, submitted: true }));
  };

  return (
    <section className="section-padding bg-darkbg" id="waitlist">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Early Access List</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            We're inviting the first 100 creators to shape the future of brand deals.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8">
            {!formState.submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-darkbg/50 border border-glassBorder rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-darkbg/50 border border-glassBorder rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="socialHandle" className="block text-sm font-medium text-white/90 mb-2">
                      Social Media Handle
                    </label>
                    <input
                      type="text"
                      id="socialHandle"
                      name="socialHandle"
                      value={formState.socialHandle}
                      onChange={handleChange}
                      required
                      className="w-full bg-darkbg/50 border border-glassBorder rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50"
                      placeholder="@yourusername"
                    />
                  </div>
                  <div>
                    <label htmlFor="followerCount" className="block text-sm font-medium text-white/90 mb-2">
                      Follower Count
                    </label>
                    <input
                      type="text"
                      id="followerCount"
                      name="followerCount"
                      value={formState.followerCount}
                      onChange={handleChange}
                      required
                      className="w-full bg-darkbg/50 border border-glassBorder rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50"
                      placeholder="e.g., 10K"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="niche" className="block text-sm font-medium text-white/90 mb-2">
                    Content Niche
                  </label>
                  <select
                    id="niche"
                    name="niche"
                    value={formState.niche}
                    onChange={handleChange}
                    required
                    className="w-full bg-darkbg/50 border border-glassBorder rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50"
                  >
                    <option value="" disabled>Select your primary niche</option>
                    <option value="fashion">Fashion</option>
                    <option value="beauty">Beauty</option>
                    <option value="fitness">Fitness</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="tech">Technology</option>
                    <option value="food">Food</option>
                    <option value="travel">Travel</option>
                    <option value="gaming">Gaming</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    className="btn-neon text-lg px-12"
                  >
                    Apply Now
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="rounded-full bg-neon/20 p-4 inline-flex mb-6">
                  <Check className="w-12 h-12 text-neon" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Thanks! You're on the waitlist.</h3>
                <p className="text-white/70 mb-6">
                  We'll reach out soon with early access information. 
                  In the meantime, follow us on social media for updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;


import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define the schema for the waitlist form
const waitlistSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  socialHandle: z.string().optional(),
  followerCount: z.string().optional(),
  niche: z.string().min(1, { message: 'Please select a content niche' })
});

// Create a TypeScript type from the schema
type WaitlistFormData = z.infer<typeof waitlistSchema>;

const WaitlistSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema)
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    
    try {
      // Insert the form data into the waitlist_submissions table
      const { error } = await supabase.from('waitlist_submissions').insert({
        name: data.name,
        email: data.email,
        social_handle: data.socialHandle || null,
        follower_count: data.followerCount || null,
        niche: data.niche || null
      });
      
      if (error) {
        throw error;
      }
      
      // Show success toast and update UI
      toast({
        title: "Success!",
        description: "You've been added to our waitlist.",
        variant: "default",
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            {!submitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      {...register('name')}
                      className={`w-full bg-darkbg/50 border ${errors.name ? 'border-red-500' : 'border-glassBorder'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={`w-full bg-darkbg/50 border ${errors.email ? 'border-red-500' : 'border-glassBorder'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="socialHandle" className="block text-sm font-medium text-white/90 mb-2">
                      Social Media Handle
                    </label>
                    <input
                      id="socialHandle"
                      {...register('socialHandle')}
                      className="w-full bg-darkbg/50 border border-glassBorder rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50"
                      placeholder="@yourusername"
                    />
                  </div>
                  <div>
                    <label htmlFor="followerCount" className="block text-sm font-medium text-white/90 mb-2">
                      Follower Count
                    </label>
                    <input
                      id="followerCount"
                      {...register('followerCount')}
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
                    {...register('niche')}
                    className={`w-full bg-darkbg/50 border ${errors.niche ? 'border-red-500' : 'border-glassBorder'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50`}
                  >
                    <option value="">Select your primary niche</option>
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
                  {errors.niche && (
                    <p className="mt-1 text-sm text-red-500">{errors.niche.message}</p>
                  )}
                </div>
                
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn-neon text-lg px-12 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Apply Now'}
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

import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const waitlistSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  socialHandle: z.string().optional(),
  followerCount: z.string().optional(),
  niche: z.string().min(1, { message: 'Please select a content niche' })
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

const WaitlistSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema)
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    setErrorDetails(null);
    
    try {
      console.log('Submitting waitlist form:', data);
      
      const { error: dbError } = await supabase.from('waitlist_submissions').insert({
        name: data.name,
        email: data.email,
        social_handle: data.socialHandle || null,
        follower_count: data.followerCount || null,
        niche: data.niche || null
      });
      
      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }
      
      console.log('Successfully saved to database, now sending confirmation emails');

      const userEmailResponse = await supabase.functions.invoke('send-email', {
        body: JSON.stringify({
          to: data.email,
          subject: 'Welcome to Creator Chapter Waitlist!',
          template: 'waitlist-confirmation',
          templateData: {
            name: data.name,
            socialHandle: data.socialHandle,
            niche: data.niche
          }
        })
      });

      console.log('User confirmation email response:', userEmailResponse);

      const adminEmail = 'your-admin-email@yourdomain.com';
      const adminEmailResponse = await supabase.functions.invoke('send-email', {
        body: JSON.stringify({
          to: adminEmail,
          subject: 'New Creator Chapter Waitlist Submission',
          template: 'admin-notification',
          templateData: {
            name: data.name,
            email: data.email,
            socialHandle: data.socialHandle,
            followerCount: data.followerCount,
            niche: data.niche
          }
        })
      });

      console.log('Admin notification email response:', adminEmailResponse);

      if (userEmailResponse.error || adminEmailResponse.error) {
        console.warn('Email sending issues:', { 
          userEmail: userEmailResponse.error, 
          adminEmail: adminEmailResponse.error 
        });
        
        toast({
          title: "Submission Saved",
          description: "Your information was saved, but we couldn't send confirmation emails. We'll contact you soon!",
          variant: "default",
        });
      } else {
        toast({
          title: "Success!",
          description: "You've been added to our waitlist. Check your email for confirmation.",
          variant: "default",
        });
      }
      
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorDetails(error.message);
      
      toast({
        title: "Error",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive",
      });
      
      setShowErrorDialog(true);
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
                  We've saved your information and will reach out soon with early access details.
                  {errorDetails ? ' (Note: There was an issue sending confirmation emails)' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submission Error Details</DialogTitle>
            <DialogDescription>
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <AlertCircle className="text-red-500 mr-2" />
                  <div>
                    <p className="text-red-700 font-medium">There was an error with your submission:</p>
                    <p className="text-sm text-red-600 mt-1">{errorDetails}</p>
                  </div>
                </div>
              </div>
              <p className="mt-4">
                Please try again or contact support if the problem persists.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WaitlistSection;

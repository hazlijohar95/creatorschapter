import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { WaitlistForm } from './waitlist/WaitlistForm';
import { WaitlistSuccessMessage } from './waitlist/WaitlistSuccessMessage';
import { WaitlistErrorDialog } from './waitlist/WaitlistErrorDialog';
import type { WaitlistFormData } from './waitlist/waitlist-schema';

const WaitlistSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

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
        
        toast("Submission Saved", {
          description: "Your information was saved, but we couldn't send confirmation emails. We'll contact you soon!"
        });
      } else {
        toast("Success!", {
          description: "You've been added to our waitlist. Check your email for confirmation."
        });
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorDetails(error.message);
      
      toast("Error", {
        description: "There was an error submitting your form. Please try again.",
        variant: "error"
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
              <WaitlistForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
            ) : (
              <WaitlistSuccessMessage hasEmailError={!!errorDetails} />
            )}
          </div>
        </div>
      </div>

      <WaitlistErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        errorDetails={errorDetails}
      />
    </section>
  );
};

export default WaitlistSection;

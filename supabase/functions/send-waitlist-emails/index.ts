
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1'; // Explicitly import React
import UserConfirmationEmail from './templates/user-confirmation.tsx';
import AdminNotificationEmail from './templates/admin-notification.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'coding@hazlijohar.com'; // Default to the verified email
const SENDER_EMAIL = 'onboarding@resend.dev'; // Using Resend's default domain

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received waitlist submission request');
    const { 
      name, 
      email, 
      socialHandle, 
      followerCount, 
      niche 
    } = await req.json();
    
    console.log('Submission data:', { name, email, socialHandle, followerCount, niche });

    // Check for required fields
    if (!name || !email) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Name and email are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Validate RESEND_API_KEY
    if (!Deno.env.get('RESEND_API_KEY')) {
      console.error('Missing RESEND_API_KEY environment variable');
      return new Response(
        JSON.stringify({ error: 'Email service configuration error' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Determine if user email matches verified email in Resend
    const isEmailVerified = email === ADMIN_EMAIL;
    console.log(`Is email verified for Resend testing: ${isEmailVerified}`);

    // Information about email sending status
    const emailResults = {
      userEmailSent: false,
      userEmailError: null,
      adminEmailSent: false,
      adminEmailError: null
    };

    console.log('Rendering user email template');
    // Send user confirmation email
    const userEmailHtml = await renderAsync(
      React.createElement(UserConfirmationEmail, { name })
    );
    
    console.log('Attempting to send user confirmation email to:', email);
    
    try {
      // Only send directly to user if their email matches the verified one
      if (isEmailVerified) {
        const userEmailResponse = await resend.emails.send({
          from: `ChapterCreator <${SENDER_EMAIL}>`,
          to: [email],
          subject: 'Welcome to ChapterCreator Waitlist!',
          html: userEmailHtml,
        });
        
        if (userEmailResponse.error) {
          throw new Error(userEmailResponse.error.message);
        }
        
        console.log('User email sent successfully to verified address');
        emailResults.userEmailSent = true;
      } else {
        // For unverified emails during testing, we send the notification to the admin
        // In the real world with a verified domain, we would send directly to the user
        console.log('User email could not be sent directly due to Resend testing limitations');
        emailResults.userEmailError = 'Cannot send to unverified email addresses in test mode';
      }
    } catch (emailError) {
      console.error('Error sending user confirmation email:', emailError);
      emailResults.userEmailError = emailError.message;
    }

    console.log('Rendering admin notification email template');
    // Send admin notification email with user's information
    const adminEmailHtml = await renderAsync(
      React.createElement(AdminNotificationEmail, { 
        name, 
        email, 
        socialHandle, 
        followerCount, 
        niche 
      })
    );
    
    console.log('Sending admin notification email to:', ADMIN_EMAIL);
    
    try {
      const adminEmailResponse = await resend.emails.send({
        from: `ChapterCreator Waitlist <${SENDER_EMAIL}>`,
        to: [ADMIN_EMAIL], // Always send to the verified admin email
        subject: 'New Waitlist Submission',
        html: adminEmailHtml,
      });

      if (adminEmailResponse.error) {
        throw new Error(adminEmailResponse.error.message);
      }
      
      console.log('Admin email sent successfully');
      emailResults.adminEmailSent = true;
    } catch (emailError) {
      console.error('Error sending admin notification email:', emailError);
      emailResults.adminEmailError = emailError.message;
    }

    // Determine overall status
    const allEmailsSent = emailResults.userEmailSent && emailResults.adminEmailSent;
    const noEmailsSent = !emailResults.userEmailSent && !emailResults.adminEmailSent;
    
    if (noEmailsSent) {
      return new Response(
        JSON.stringify({ 
          status: 'error',
          message: 'Unable to send any notification emails',
          details: 'Unable to send emails. This is likely because no verified domain is set up in Resend.',
          emailResults
        }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    } else if (!allEmailsSent) {
      return new Response(
        JSON.stringify({ 
          status: 'partial_success',
          message: 'Submission processed but not all emails could be sent',
          details: 'In test mode, Resend can only send emails to verified addresses. To send to any recipient, verify a domain at resend.com/domains.',
          emailResults 
        }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 207
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        status: 'success',
        message: 'Submission processed and all notifications sent',
        emailResults 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in send-waitlist-emails function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

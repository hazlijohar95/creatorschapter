
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1'; // Explicitly import React
import UserConfirmationEmail from './templates/user-confirmation.tsx';
import AdminNotificationEmail from './templates/admin-notification.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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

    console.log('Rendering user email template');
    // Send user confirmation email
    const userEmailHtml = await renderAsync(
      React.createElement(UserConfirmationEmail, { name })
    );
    
    console.log('Sending user confirmation email to:', email);
    let userEmailResponse;
    try {
      userEmailResponse = await resend.emails.send({
        from: 'ChapterCreator <onboarding@chaptercreator.dev>',
        to: [email],
        subject: 'Welcome to ChapterCreator Waitlist!',
        html: userEmailHtml,
      });
      console.log('User email sent successfully:', userEmailResponse);
    } catch (emailError) {
      console.error('Error sending user confirmation email:', emailError);
      // Continue execution to try sending admin email
      userEmailResponse = { error: emailError.message };
    }

    console.log('Rendering admin notification email template');
    // Send admin notification email
    const adminEmailHtml = await renderAsync(
      React.createElement(AdminNotificationEmail, { 
        name, 
        email, 
        socialHandle, 
        followerCount, 
        niche 
      })
    );
    
    console.log('Sending admin notification email');
    let adminEmailResponse;
    try {
      adminEmailResponse = await resend.emails.send({
        from: 'ChapterCreator Waitlist <waitlist@chaptercreator.dev>',
        to: ['hello@creatorchapter.com'], // Admin email
        subject: 'New Waitlist Submission',
        html: adminEmailHtml,
      });
      console.log('Admin email sent successfully:', adminEmailResponse);
    } catch (emailError) {
      console.error('Error sending admin notification email:', emailError);
      adminEmailResponse = { error: emailError.message };
    }

    // Determine if there were any email sending errors
    const hasErrors = userEmailResponse.error || adminEmailResponse.error;
    
    if (hasErrors) {
      return new Response(
        JSON.stringify({ 
          status: 'partial_success',
          message: 'Submission saved but email delivery had issues',
          userEmailResponse, 
          adminEmailResponse 
        }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 207 // Partial success
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        status: 'success',
        userEmailResponse, 
        adminEmailResponse 
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

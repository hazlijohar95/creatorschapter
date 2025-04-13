
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
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
    const { 
      name, 
      email, 
      socialHandle, 
      followerCount, 
      niche 
    } = await req.json();

    // Send user confirmation email
    const userEmailHtml = await renderAsync(
      React.createElement(UserConfirmationEmail, { name })
    );

    const userEmailResponse = await resend.emails.send({
      from: 'ChapterCreator <onboarding@chaptercreator.dev>',
      to: [email],
      subject: 'Welcome to ChapterCreator Waitlist!',
      html: userEmailHtml,
    });

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

    const adminEmailResponse = await resend.emails.send({
      from: 'ChapterCreator Waitlist <waitlist@chaptercreator.dev>',
      to: ['hello@creatorchapter.com'], // Updated admin email
      subject: 'New Waitlist Submission',
      html: adminEmailHtml,
    });

    return new Response(JSON.stringify({ 
      userEmailResponse, 
      adminEmailResponse 
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
      status: 200
    });

  } catch (error) {
    console.error('Error sending emails:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
      status: 500
    });
  }
});


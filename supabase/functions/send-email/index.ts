
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  template: 'waitlist-confirmation' | 'admin-notification'
  templateData: Record<string, string>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { to, subject, template, templateData }: EmailRequest = await req.json()
    console.log('Processing email request:', { to, subject, template })

    let htmlContent = ''
    
    // Select template based on type
    switch (template) {
      case 'waitlist-confirmation':
        htmlContent = generateWaitlistConfirmationEmail(templateData)
        break
      case 'admin-notification':
        htmlContent = generateAdminNotificationEmail(templateData)
        break
      default:
        throw new Error('Invalid template type')
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
        }],
        from: { email: 'waitlist@dealflow.com', name: 'Dealflow Waitlist' },
        subject: subject,
        content: [{
          type: 'text/html',
          value: htmlContent,
        }],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('SendGrid API error:', error)
      throw new Error('Failed to send email')
    }

    console.log('Email sent successfully to:', to)
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in send-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

// Email template functions
function generateWaitlistConfirmationEmail(data: Record<string, string>) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Welcome to Dealflow!</h1>
        <p>Hi ${data.name},</p>
        <p>Thank you for joining our waitlist! We're excited to have you as one of our early supporters.</p>
        <p>We'll keep you updated on our progress and let you know as soon as we're ready to launch.</p>
        <div style="margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
          <p style="margin: 0;"><strong>Your Details:</strong></p>
          <p style="margin: 10px 0;">Name: ${data.name}</p>
          ${data.socialHandle ? `<p style="margin: 10px 0;">Social Handle: ${data.socialHandle}</p>` : ''}
          ${data.niche ? `<p style="margin: 10px 0;">Content Niche: ${data.niche}</p>` : ''}
        </div>
        <p>Best regards,<br>The Dealflow Team</p>
      </div>
    </body>
    </html>
  `
}

function generateAdminNotificationEmail(data: Record<string, string>) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">New Waitlist Submission</h2>
        <div style="margin: 20px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
          <p style="margin: 10px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${data.email}</p>
          ${data.socialHandle ? `<p style="margin: 10px 0;"><strong>Social Handle:</strong> ${data.socialHandle}</p>` : ''}
          ${data.followerCount ? `<p style="margin: 10px 0;"><strong>Follower Count:</strong> ${data.followerCount}</p>` : ''}
          ${data.niche ? `<p style="margin: 10px 0;"><strong>Content Niche:</strong> ${data.niche}</p>` : ''}
        </div>
      </div>
    </body>
    </html>
  `
}

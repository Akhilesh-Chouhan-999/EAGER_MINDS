const { Resend } = require('resend')

/**
 * Service handler to dispatch onboarding welcome emails using Resend.
 */
let resendInstance = null

const sendWelcomeEmail = async (email, handle) => {
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    console.log('Resend API Key is missing. Skipping email dispatch.')
    return
  }

  try {
    if (!resendInstance) {
      resendInstance = new Resend(resendApiKey)
    }
    await resendInstance.emails.send({
      from: 'EagerMinds Bookmarks <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to EagerMinds Bookmarks!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #2563eb;">Welcome to EagerMinds Bookmarks!</h2>
          <p>Hi there,</p>
          <p>Thank you for signing up for your personal bookmarks manager! Your handle is officially registered.</p>
          <p>Your public profile will be available at @${handle}.</p>
          <p>If you haven't confirmed your email yet, please check your inbox for a verification email to activate your account.</p>
          <br/>
          <p>Best regards,<br/>The EagerMinds Team</p>
        </div>
      `,
    })
  } catch (emailErr) {
    console.error('Failed to send onboarding email via Resend:', emailErr)
  }
}

module.exports = { sendWelcomeEmail }

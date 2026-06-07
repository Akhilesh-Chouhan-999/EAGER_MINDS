'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { Resend } from 'resend'

/**
 * Validates the handle format.
 * Allowed characters: a-z, 0-9, underscores. Must be at least 3 characters.
 */
function validateHandle(handle: string): string | null {
  const clean = handle.trim().toLowerCase()
  if (clean.length < 3) {
    return 'Handle must be at least 3 characters long.'
  }
  if (!/^[a-z0-9_]+$/.test(clean)) {
    return 'Handle can only contain lowercase letters, numbers, and underscores.'
  }
  return null
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const rawHandle = formData.get('handle') as string

  if (!email || !password || !rawHandle) {
    return { error: 'All fields are required.' }
  }

  const handle = rawHandle.trim().toLowerCase()
  const handleValidationError = validateHandle(handle)
  if (handleValidationError) {
    return { error: handleValidationError }
  }

  const supabase = await createClient()

  // 1. Pre-check if handle is already taken in profiles table
  const { data: existingProfile, error: profileCheckError } = await supabase
    .from('profiles')
    .select('handle')
    .eq('handle', handle)
    .maybeSingle()

  if (profileCheckError) {
    return { error: 'Database verification failed. Please try again.' }
  }

  if (existingProfile) {
    return { error: 'This @handle is already taken. Please choose another one.' }
  }

  // Determine base URL dynamically for redirects & onboarding links
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  // 2. Call Supabase signUp
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${baseUrl}/api/auth/callback`,
      data: {
        handle: handle,
      },
    },
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  // 3. Send onboarding welcome email using Resend
  const resendApiKey = process.env.RESEND_API_KEY
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey)
      await resend.emails.send({
        from: 'EagerMinds Bookmarks <onboarding@resend.dev>',
        to: email,
        subject: 'Welcome to EagerMinds Bookmarks!',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #2563eb;">Welcome to EagerMinds Bookmarks!</h2>
            <p>Hi there,</p>
            <p>Thank you for signing up for your personal bookmarks manager! Your handle is officially registered.</p>
            <p>Your public profile will be available at:</p>
            <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; font-weight: bold; font-family: monospace;">
              <a href="${baseUrl}/${handle}" style="color: #2563eb; text-decoration: none;">${baseUrl}/${handle}</a>
            </p>
            <p>If you haven't confirmed your email yet, please check your inbox for a verification email from Supabase to activate your account and access your dashboard.</p>
            <br/>
            <p>Best regards,<br/>The EagerMinds Team</p>
          </div>
        `,
      })
    } catch (emailErr) {
      // Log error but do not block user signup since auth succeeded
      console.error('Failed to send welcome email via Resend:', emailErr)
    }
  } else {
    console.warn('RESEND_API_KEY environment variable is not defined.')
  }

  // Direct user depending on confirmation requirement
  const isConfirmed = signUpData?.user?.identities?.length === 0 || signUpData?.session !== null
  if (isConfirmed) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } else {
    return { success: 'Registration successful! Please check your email for the confirmation link.' }
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

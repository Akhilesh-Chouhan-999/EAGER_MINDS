const { createClient } = require('@supabase/supabase-js')

/**
 * Creates a Supabase client.
 * If a token is provided, it configures headers to proxy that user session,
 * thereby forcing Supabase to enforce Row Level Security (RLS) policies.
 */
function getSupabaseClient(token = null) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be configured in environment variables.')
  }

  const options = {}
  if (token) {
    options.global = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  }

  return createClient(supabaseUrl, supabaseAnonKey, options)
}

module.exports = { getSupabaseClient }

const { createClient } = require('@supabase/supabase-js')
const ws = require('ws')

/**
 * Creates a Supabase client.
 * If a token is provided, it configures headers to proxy that user session,
 * thereby forcing Supabase to enforce Row Level Security (RLS) policies.
 *
 * NOTE: The `ws` package is provided as the WebSocket transport because
 * Node.js 20 does not have native WebSocket support (added in Node.js 22+).
 */
function getSupabaseClient(token = null) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be configured in environment variables.')
  }

  const options = {
    realtime: {
      transport: ws,
    },
  }

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

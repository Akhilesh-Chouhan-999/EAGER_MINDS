/**
 * Schema setup script — checks existing tables and applies migration.
 * Run from the backend/ directory: node ../scripts/apply-schema.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function checkTables() {
  console.log('🔍 Checking existing tables...\n')
  
  const tables = ['profiles', 'bookmarks']
  const results = {}
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1)
    if (error && error.code === '42P01') {
      results[table] = 'MISSING'
    } else if (error) {
      results[table] = `ERROR: ${error.message}`
    } else {
      results[table] = 'EXISTS'
    }
  }
  
  // Check tags column on bookmarks
  if (results.bookmarks === 'EXISTS') {
    const { data, error } = await supabase.from('bookmarks').select('tags').limit(1)
    if (error && error.message.includes('tags')) {
      results['bookmarks.tags'] = 'MISSING COLUMN'
    } else {
      results['bookmarks.tags'] = 'EXISTS'
    }
  }
  
  return results
}

checkTables().then(results => {
  console.log('📋 Table Status:')
  for (const [key, status] of Object.entries(results)) {
    const icon = status === 'EXISTS' ? '✅' : status === 'MISSING' ? '❌' : status === 'MISSING COLUMN' ? '⚠️' : '🔴'
    console.log(`  ${icon} ${key}: ${status}`)
  }
  
  console.log('\n')
  
  const needsFullSchema = results.profiles === 'MISSING' || results.bookmarks === 'MISSING'
  const needsTagsMigration = results['bookmarks.tags'] === 'MISSING COLUMN'
  
  if (needsFullSchema) {
    console.log('❗ Tables are MISSING. You need to run the FULL schema.')
    console.log('\n📋 Steps:')
    console.log('  1. Open: https://supabase.com/dashboard/project/ggcqzqnsqbjkzqdnqpaj/sql/new')
    console.log('  2. Copy the FULL contents of: context/schema.sql')
    console.log('  3. Paste and click RUN\n')
  } else if (needsTagsMigration) {
    console.log('⚠️  Tables exist but tags column is MISSING. You need to run a migration.')
    console.log('\n📋 Run this in the Supabase SQL Editor:')
    console.log('  https://supabase.com/dashboard/project/ggcqzqnsqbjkzqdnqpaj/sql/new\n')
    console.log('  ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS tags text[] DEFAULT \'{}\';')
    console.log('  CREATE INDEX IF NOT EXISTS idx_bookmarks_tags ON public.bookmarks USING GIN(tags);\n')
  } else {
    console.log('✅ All tables and columns exist! Database is ready.')
    console.log('🚀 You can start the app with: npm run dev\n')
  }
}).catch(err => {
  console.error('❌ Failed to connect to Supabase:', err.message)
  console.log('\nPlease check your SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env\n')
})

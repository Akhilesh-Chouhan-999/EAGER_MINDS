const { Client } = require('pg')

const client = new Client({
  host: 'db.ggcqzqnsqbjkzqdnqpaj.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'aKHILESH@123#',
  ssl: { rejectUnauthorized: false }
})

async function migrate() {
  await client.connect()
  console.log('✅ Connected to Supabase database!')

  const queries = [
    'ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS description text',
    'ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS favicon_url text',
    "ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'",
    'CREATE INDEX IF NOT EXISTS idx_bookmarks_tags ON public.bookmarks USING GIN(tags)'
  ]

  for (const q of queries) {
    await client.query(q)
    console.log('✅ Ran:', q.substring(0, 70))
  }

  // Verify all columns exist
  const { rows } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bookmarks'
    ORDER BY ordinal_position
  `)
  console.log('\n📋 bookmarks columns:', rows.map(r => r.column_name).join(', '))
  
  await client.end()
  console.log('\n🚀 Migration complete! Database is fully ready.')
}

migrate().catch(e => {
  console.error('❌ ERROR:', e.message)
  process.exit(1)
})

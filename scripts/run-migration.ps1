Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host " EagerMinds — Supabase Migration Auto-Runner   " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening Supabase login in your browser..." -ForegroundColor Yellow
Write-Host "After logging in, come back here and press ENTER." -ForegroundColor Yellow
Write-Host ""

Start-Process "https://supabase.com/dashboard/account/tokens"

Write-Host "STEP 1: In the browser page that just opened:"
Write-Host "  - Click 'Generate new token'"
Write-Host "  - Name it anything (e.g. 'migration')"
Write-Host "  - Copy the token"
Write-Host ""
$token = Read-Host "Paste your Personal Access Token here"

Write-Host ""
Write-Host "Running migration..." -ForegroundColor Green

$env:SUPABASE_ACCESS_TOKEN = $token

# Link the project
Write-Host "Linking project..."
supabase link --project-ref ggcqzqnsqbjkzqdnqpaj 2>&1 | Out-Null

# Run the migration SQL directly
$sql = @"
ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS favicon_url text;
ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_bookmarks_tags ON public.bookmarks USING GIN(tags);
"@

$sql | supabase db execute --stdin 2>&1

Write-Host ""
Write-Host "Done! Migration applied." -ForegroundColor Green

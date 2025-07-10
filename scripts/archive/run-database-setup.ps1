# PowerShell script to run the COMPLETE_DATABASE_SETUP.sql on Supabase
# Run this from your project root directory

Write-Host "================================" -ForegroundColor Green
Write-Host "BINNA PLATFORM - DATABASE SETUP" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

Write-Host "This script will help you run the database setup on your remote Supabase database." -ForegroundColor Yellow
Write-Host ""

Write-Host "OPTION 1: Manual Setup (Recommended)" -ForegroundColor Cyan
Write-Host "--------------------------------------" -ForegroundColor Cyan
Write-Host "1. Go to your Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Open your project: qghcdswwagbwqqqtcrfq" -ForegroundColor White
Write-Host "3. Navigate to 'SQL Editor' in the left sidebar" -ForegroundColor White
Write-Host "4. Click 'New query'" -ForegroundColor White
Write-Host "5. Copy and paste the contents of COMPLETE_DATABASE_SETUP.sql" -ForegroundColor White
Write-Host "6. Click 'RUN' to execute the script" -ForegroundColor White
Write-Host ""

Write-Host "OPTION 2: Command Line Setup" -ForegroundColor Cyan
Write-Host "-----------------------------" -ForegroundColor Cyan
Write-Host "If you have psql installed, you can run:" -ForegroundColor White
Write-Host ""
Write-Host "psql 'postgresql://postgres.qghcdswwagbwqqqtcrfq:TFxqNB03GBp*2vGy@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres' -f COMPLETE_DATABASE_SETUP.sql" -ForegroundColor Yellow
Write-Host ""

Write-Host "OPTION 3: Supabase CLI (if installed)" -ForegroundColor Cyan
Write-Host "-------------------------------------" -ForegroundColor Cyan
Write-Host "If you have Supabase CLI installed:" -ForegroundColor White
Write-Host "1. supabase login" -ForegroundColor Yellow
Write-Host "2. supabase db push --project-ref qghcdswwagbwqqqtcrfq" -ForegroundColor Yellow
Write-Host ""

Write-Host "After running the script, verify the setup by checking:" -ForegroundColor Green
Write-Host "- Tables are created (products, pos_transactions, inventory_movements, etc.)" -ForegroundColor White
Write-Host "- Indexes are in place" -ForegroundColor White
Write-Host "- RLS policies are enabled" -ForegroundColor White
Write-Host "- Triggers are working" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Press Enter to continue or 'q' to quit"
if ($continue -eq 'q') {
    exit
}

Write-Host ""
Write-Host "Opening COMPLETE_DATABASE_SETUP.sql file for review..." -ForegroundColor Green

# Check if the SQL file exists
if (Test-Path "COMPLETE_DATABASE_SETUP.sql") {
    Write-Host "SQL file found. You can now copy its contents to Supabase SQL Editor." -ForegroundColor Green
    
    # Option to open the file in default editor
    $openFile = Read-Host "Would you like to open the SQL file in your default editor? (y/n)"
    if ($openFile -eq 'y' -or $openFile -eq 'Y') {
        Start-Process "COMPLETE_DATABASE_SETUP.sql"
    }
} else {
    Write-Host "ERROR: COMPLETE_DATABASE_SETUP.sql file not found!" -ForegroundColor Red
    Write-Host "Make sure you're running this script from the project root directory." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Database setup instructions provided. Follow Option 1 for the easiest setup." -ForegroundColor Green
Write-Host ""

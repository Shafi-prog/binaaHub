@echo off
REM Enhanced Store Features Database Setup Script (Windows)
REM This script will run the complete database setup on your remote Supabase instance

echo 🚀 Starting Enhanced Store Features Database Setup...
echo 📡 Connecting to remote Supabase instance: lqhopwohuddhapkhhikf.supabase.co

set PROJECT_REF=lqhopwohuddhapkhhikf

echo 🔐 Checking Supabase authentication...
supabase projects list >nul 2>&1
if errorlevel 1 (
    echo ❌ Not logged in to Supabase. Please run: supabase login
    echo 📖 Then link your project with: supabase link --project-ref %PROJECT_REF%
    pause
    exit /b 1
)

echo 🔗 Linking to Supabase project...
supabase link --project-ref %PROJECT_REF% >nul 2>&1

echo 📊 Executing database setup script...
echo ⏳ This may take a few moments...

REM Try to execute SQL directly using psql if available
where psql >nul 2>&1
if not errorlevel 1 (
    echo 🎯 Using psql to execute SQL script...
    psql "postgresql://postgres:[SERVICE_KEY]@db.lqhopwohuddhapkhhikf.supabase.co:5432/postgres" -f COMPLETE_DATABASE_SETUP.sql
) else (
    echo 📝 psql not found. Please run the SQL manually.
    echo.
    echo 💡 Manual steps:
    echo 1. Go to https://supabase.com/dashboard/project/%PROJECT_REF%
    echo 2. Navigate to SQL Editor
    echo 3. Copy and paste the contents of COMPLETE_DATABASE_SETUP.sql
    echo 4. Click Run
    echo.
    echo 📄 Opening the SQL file for you to copy...
    notepad COMPLETE_DATABASE_SETUP.sql
)

echo.
echo 🎉 Setup script completed!
echo 🌐 Database URL: https://lqhopwohuddhapkhhikf.supabase.co
echo.
echo Next steps:
echo 1. Verify the SQL ran successfully in Supabase Dashboard
echo 2. Start your development server: npm run dev
echo 3. Test the new POS system at: /store/pos
echo 4. Check inventory management at: /store/inventory
echo.
pause

@echo off
echo Forcing cleanup of all development processes...

echo Killing Node.js processes...
taskkill /F /IM node.exe /T >nul 2>&1

echo Killing Next.js processes...
taskkill /F /IM next.exe /T >nul 2>&1

echo Killing npm processes...
taskkill /F /IM npm.exe /T >nul 2>&1

echo Cleaning up ports...
for /l %%i in (3000,1,3010) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%i') do taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ✓ All development processes have been terminated.
echo ✓ You can now safely close VS Code.
echo.
pause

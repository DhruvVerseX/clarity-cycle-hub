@echo off
echo Killing all Node.js processes...
taskkill /f /im node.exe 2>nul
echo.
echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul
echo.
echo Starting the application...
echo.
cd /d "%~dp0"
pnpm run dev:full
pause 
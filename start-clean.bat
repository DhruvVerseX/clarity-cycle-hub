@echo off
echo ========================================
echo CLARITY CYCLE HUB - CLEAN START
echo ========================================
echo.
echo Killing all Node.js processes...
taskkill /f /im node.exe 2>nul
echo.
echo Waiting 5 seconds for cleanup...
timeout /t 5 /nobreak >nul
echo.
echo Starting the application...
echo.
cd /d "%~dp0"
echo Frontend will be on: http://localhost:5173
echo Backend will be on: http://localhost:5001
echo.
pnpm run dev:full
pause 
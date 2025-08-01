@echo off
chcp 65001 >nul
echo 🚀 Starting Clarity Cycle Hub Development Environment...

REM Check if .env file exists in server directory
if not exist "server\.env" (
    echo 📝 Creating server environment file...
    copy "server\env.example" "server\.env"
    echo ✅ Created server\.env file
    echo    Please edit server\.env with your MongoDB connection details
    echo    For local MongoDB: MONGODB_URI=mongodb://localhost:27017/clarity-cycle-hub
    echo    For MongoDB Atlas: MONGODB_URI=mongodb+srv://^<username^>:^<password^>@^<cluster^>.mongodb.net/clarity-cycle-hub
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    pnpm install
)

if not exist "server\node_modules" (
    echo 📦 Installing server dependencies...
    cd server
    pnpm install
    cd ..
)

REM Start the development environment
echo 🎯 Starting development servers...
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo    Health:   http://localhost:5000/api/health
echo.
echo Press Ctrl+C to stop all servers
echo.

pnpm run dev:full 
#!/bin/bash

# Clarity Cycle Hub - Development Startup Script
echo "🚀 Starting Clarity Cycle Hub Development Environment..."

# Check if MongoDB is running (for local installations)
if command -v mongosh &> /dev/null; then
    echo "📊 Checking MongoDB connection..."
    if mongosh --eval "db.runCommand('ping')" &> /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB first."
        echo "   For Windows: net start MongoDB"
        echo "   For macOS: brew services start mongodb-community"
        echo "   For Linux: sudo systemctl start mongod"
        echo ""
        echo "   Or use MongoDB Atlas (cloud) instead."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
else
    echo "ℹ️  MongoDB client not found. Make sure MongoDB is installed and running."
fi

# Check if .env file exists in server directory
if [ ! -f "server/.env" ]; then
    echo "📝 Creating server environment file..."
    cp server/env.example server/.env
    echo "✅ Created server/.env file"
    echo "   Please edit server/.env with your MongoDB connection details"
    echo "   For local MongoDB: MONGODB_URI=mongodb://localhost:27017/clarity-cycle-hub"
    echo "   For MongoDB Atlas: MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/clarity-cycle-hub"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    pnpm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && pnpm install && cd ..
fi

# Start the development environment
echo "🎯 Starting development servers..."
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   Health:   http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

pnpm run dev:full 
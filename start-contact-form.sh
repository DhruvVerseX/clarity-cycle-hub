#!/bin/bash

echo "🚀 Starting Contact Form Setup..."
echo "=================================="

# Check if .env file exists in server directory
if [ ! -f "server/.env" ]; then
    echo "⚠️  No .env file found in server directory!"
    echo "📋 Please create server/.env with the following variables:"
    echo ""
    echo "EMAIL_SERVICE=gmail"
    echo "EMAIL_USER=your-email@gmail.com"
    echo "EMAIL_PASSWORD=your-app-password"
    echo "HOST_EMAIL=your-host-email@gmail.com"
    echo ""
    echo "📖 See EMAIL_SETUP.md for detailed instructions"
    exit 1
fi

echo "✅ Found .env file"

# Start the development servers
echo ""
echo "🔧 Starting development servers..."
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:5000"
echo "   - Contact API: http://localhost:5000/api/contact"
echo ""

# Run the development command
npm run dev:full
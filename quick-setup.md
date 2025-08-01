# Quick Setup Guide - Get Running in 5 Minutes

## Step 1: Set up MongoDB Atlas (Free Cloud Database)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/atlas
2. **Sign up for free account** (no credit card required)
3. **Create a free cluster**:
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred region
   - Click "Create"

## Step 2: Get Your Connection String

1. **Click "Connect" on your cluster**
2. **Choose "Connect your application"**
3. **Copy the connection string** (looks like this):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/
   ```

## Step 3: Update Your Environment File

1. **Open `server/.env`** in your project
2. **Replace the MONGODB_URI line** with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clarity-cycle-hub
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

## Step 4: Run the Application

```bash
# In your project directory
pnpm run dev:full
```

## What This Will Give You

✅ **Full authentication system** with user registration/login  
✅ **Protected API endpoints** for tasks and pomodoros  
✅ **User-specific data isolation**  
✅ **JWT token management**  
✅ **Complete frontend and backend**  

## Test the Application

1. **Frontend**: http://localhost:5173
2. **Backend API**: http://localhost:5000/api/health
3. **Register a user**: POST http://localhost:5000/api/auth/register

## If You Get Stuck

- **MongoDB Atlas**: https://www.mongodb.com/atlas
- **Connection string format**: `mongodb+srv://username:password@cluster.mongodb.net/database-name`
- **Make sure to replace**: username, password, and cluster with your actual values

## Alternative: Local MongoDB

If you prefer local installation:
1. Download MongoDB Community Server
2. Install and start the service
3. Use connection string: `mongodb://localhost:27017/clarity-cycle-hub` 
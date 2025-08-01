# MongoDB Integration Setup Guide

This guide will help you set up MongoDB for your Clarity Cycle Hub application.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local installation or MongoDB Atlas account)
3. **pnpm** (package manager)

## Setup Options

### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Edition:**
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB Service:**
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running:**
   ```bash
   mongosh
   # or
   mongo
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster:**
   - Choose "Free" tier
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Set up Database Access:**
   - Go to "Database Access"
   - Create a new database user with read/write permissions
   - Note down username and password

4. **Set up Network Access:**
   - Go to "Network Access"
   - Add your IP address or `0.0.0.0/0` for all IPs

5. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

## Environment Configuration

1. **Create environment file:**
   ```bash
   cd server
   cp env.example .env
   ```

2. **Configure your `.env` file:**

   **For Local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/clarity-cycle-hub
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

   **For MongoDB Atlas:**
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/clarity-cycle-hub
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

   Replace `<username>`, `<password>`, and `<cluster>` with your actual MongoDB Atlas credentials.

## Installation & Setup

1. **Install server dependencies:**
   ```bash
   cd server
   pnpm install
   ```

2. **Install frontend dependencies (if not already done):**
   ```bash
   cd ..
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   # Terminal 1 - Start the backend
   cd server
   pnpm dev
   
   # Terminal 2 - Start the frontend
   cd ..
   pnpm dev
   ```

## API Endpoints

The server provides the following REST API endpoints:

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Pomodoro Sessions
- `GET /api/pomodoro-sessions` - Get all sessions
- `POST /api/pomodoro-sessions` - Create a new session
- `PUT /api/pomodoro-sessions/:id/complete` - Complete a session

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### Task Schema
```javascript
{
  title: String (required),
  description: String,
  status: "todo" | "in-progress" | "completed",
  priority: "low" | "medium" | "high",
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Pomodoro Session Schema
```javascript
{
  duration: Number (required),
  taskId: ObjectId (reference to Task),
  completed: Boolean,
  startTime: Date,
  endTime: Date,
  notes: String
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string format
   - Verify network access (for Atlas)

2. **CORS Errors:**
   - Check `CORS_ORIGIN` in `.env`
   - Ensure frontend URL matches

3. **Port Already in Use:**
   - Change `PORT` in `.env`
   - Update frontend API URL accordingly

4. **Authentication Errors (Atlas):**
   - Verify username/password
   - Check IP whitelist
   - Ensure database user has correct permissions

### Debug Commands

```bash
# Check MongoDB status
mongosh --eval "db.runCommand('ping')"

# View server logs
cd server
pnpm dev

# Test API endpoints
curl http://localhost:5000/api/health
```

## Production Deployment

1. **Environment Variables:**
   - Set `NODE_ENV=production`
   - Use strong MongoDB credentials
   - Configure proper CORS origins

2. **Security:**
   - Use environment variables for sensitive data
   - Implement proper authentication
   - Add rate limiting
   - Enable HTTPS

3. **Performance:**
   - Add database indexes
   - Implement caching
   - Monitor query performance

## Next Steps

- [ ] Add user authentication
- [ ] Implement real-time updates with WebSockets
- [ ] Add data validation middleware
- [ ] Create database indexes for better performance
- [ ] Add automated testing
- [ ] Implement backup strategies

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review MongoDB logs
3. Check server console for error messages
4. Verify environment variables are set correctly 
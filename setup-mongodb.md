# MongoDB Setup Guide

## Quick Setup Options

### Option 1: MongoDB Community Server (Recommended)

1. **Download MongoDB Community Server**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select your platform (Windows)
   - Download the latest version

2. **Install MongoDB**:
   - Run the installer
   - Choose "Complete" installation
   - Install MongoDB Compass (GUI tool) if prompted
   - Complete the installation

3. **Start MongoDB Service**:
   ```bash
   # On Windows, MongoDB should start automatically as a service
   # To check if it's running:
   net start MongoDB
   ```

### Option 2: MongoDB Atlas (Cloud - No Local Installation)

1. **Create MongoDB Atlas Account**:
   - Go to: https://www.mongodb.com/atlas
   - Sign up for a free account

2. **Create a Cluster**:
   - Choose "Free" tier
   - Select your preferred region
   - Create cluster

3. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update Environment Variables**:
   ```env
   # In server/.env file
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/clarity-cycle-hub
   ```

### Option 3: Docker (Advanced)

1. **Install Docker Desktop**:
   - Download from: https://www.docker.com/products/docker-desktop

2. **Run MongoDB Container**:
   ```bash
   docker run -d --name mongodb -p 27017:27017 mongo:latest
   ```

## Verify MongoDB Installation

### Check if MongoDB is Running

```bash
# Windows
net start MongoDB

# Or check if port 27017 is listening
netstat -an | findstr 27017
```

### Test Connection

```bash
# If MongoDB is installed locally
mongosh
# or
mongo
```

## Update Environment Variables

1. **For Local MongoDB**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/clarity-cycle-hub
   ```

2. **For MongoDB Atlas**:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/clarity-cycle-hub
   ```

## Start the Application

Once MongoDB is running:

```bash
# From the project root
pnpm run dev:full
```

## Troubleshooting

### MongoDB Not Starting

1. **Check if MongoDB service exists**:
   ```bash
   sc query MongoDB
   ```

2. **Start MongoDB service manually**:
   ```bash
   net start MongoDB
   ```

3. **If service doesn't exist, install MongoDB properly**

### Connection Refused Error

1. **Check if MongoDB is running**:
   ```bash
   netstat -an | findstr 27017
   ```

2. **Start MongoDB**:
   ```bash
   net start MongoDB
   ```

3. **Check firewall settings**

### Permission Issues

1. **Run as Administrator**:
   - Right-click Command Prompt
   - "Run as administrator"

2. **Check MongoDB data directory permissions**

## Alternative: Use MongoDB Atlas (Recommended for Quick Start)

If you want to get started quickly without installing MongoDB locally:

1. **Sign up for MongoDB Atlas** (free tier)
2. **Create a cluster**
3. **Get your connection string**
4. **Update server/.env file**
5. **Run the application**

This is the easiest way to get started and doesn't require any local installation. 
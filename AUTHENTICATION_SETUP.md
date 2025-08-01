# Authentication System Setup Guide

This guide covers the complete authentication system implemented in the Clarity Cycle Hub application.

## Overview

The authentication system uses:
- **JWT (JSON Web Tokens)** for stateless authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **MongoDB** for user data storage

## Features

### ✅ **Implemented Features:**

1. **User Registration**
   - Username and email uniqueness validation
   - Password strength requirements
   - Automatic user preferences setup
   - JWT token generation

2. **User Login**
   - Email/password authentication
   - Account status verification
   - Last login tracking
   - JWT token generation

3. **Profile Management**
   - Get user profile
   - Update profile information
   - Change password
   - Account deactivation

4. **Security Features**
   - Password hashing with bcrypt
   - JWT token expiration
   - Input validation and sanitization
   - Account status checking

5. **Protected Routes**
   - All task and pomodoro endpoints require authentication
   - User-specific data isolation
   - Automatic token validation

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | User login | ❌ |
| `GET` | `/api/auth/profile` | Get user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update user profile | ✅ |
| `PUT` | `/api/auth/change-password` | Change password | ✅ |
| `DELETE` | `/api/auth/account` | Delete account | ✅ |

### Protected Data Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/tasks` | Get user tasks | ✅ |
| `POST` | `/api/tasks` | Create task | ✅ |
| `PUT` | `/api/tasks/:id` | Update task | ✅ |
| `DELETE` | `/api/tasks/:id` | Delete task | ✅ |
| `GET` | `/api/pomodoro-sessions` | Get sessions | ✅ |
| `POST` | `/api/pomodoro-sessions` | Create session | ✅ |
| `PUT` | `/api/pomodoro-sessions/:id/complete` | Complete session | ✅ |

## Environment Configuration

### Required Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/clarity-cycle-hub

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Security Recommendations

1. **JWT Secret**: Use a strong, random secret (at least 32 characters)
2. **Token Expiration**: Set appropriate expiration times
3. **HTTPS**: Use HTTPS in production
4. **Rate Limiting**: Implement rate limiting for auth endpoints

## User Registration

### Request Format

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Validation Rules

- **Username**: 3-30 characters, alphanumeric + underscore/hyphen
- **Email**: Valid email format, unique
- **Password**: Minimum 8 characters, uppercase + lowercase + number
- **Names**: Optional, max 50 characters each

### Response Format

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "preferences": {
      "defaultPomodoroDuration": 25,
      "defaultBreakDuration": 5,
      "autoStartBreaks": false,
      "autoStartPomodoros": false,
      "soundEnabled": true,
      "notificationsEnabled": true,
      "theme": "system"
    },
    "stats": {
      "totalPomodoros": 0,
      "totalTasks": 0,
      "totalCompletedTasks": 0,
      "totalFocusTime": 0,
      "currentStreak": 0,
      "longestStreak": 0
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## User Login

### Request Format

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Response Format

Same as registration response, with updated `lastLoginAt` timestamp.

## Authentication Flow

### Frontend Implementation

1. **Token Storage**: Store JWT in localStorage
2. **Request Headers**: Include `Authorization: Bearer <token>`
3. **Token Validation**: Check token expiration on app start
4. **Auto-logout**: Redirect to login on 401 responses

### Backend Implementation

1. **Middleware**: `authenticateToken` validates JWT
2. **User Context**: Attach user data to request object
3. **Data Isolation**: Filter queries by `userId`
4. **Error Handling**: Proper error responses for auth failures

## Security Features

### Password Security

- **Hashing**: bcrypt with 12 salt rounds
- **Validation**: Minimum 8 characters, complexity requirements
- **Storage**: Never store plain text passwords

### Token Security

- **Expiration**: Configurable token lifetime
- **Validation**: Verify token signature and expiration
- **Refresh**: Future implementation for token refresh

### Data Protection

- **User Isolation**: All data filtered by user ID
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error messages

## Database Schema Updates

### User Model

```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (optional),
  lastName: String (optional),
  avatar: String (optional),
  preferences: Object (default settings),
  stats: Object (user statistics),
  isActive: Boolean (default: true),
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model Updates

```javascript
{
  // ... existing fields
  userId: String (required for user isolation)
}
```

### PomodoroSession Model Updates

```javascript
{
  // ... existing fields
  userId: String (required for user isolation)
}
```

## Frontend Integration

### Authentication Hooks

```typescript
// Check authentication status
const isAuthenticated = tokenUtils.isAuthenticated();

// Store token after login
tokenUtils.storeToken(token);

// Remove token on logout
tokenUtils.removeToken();
```

### API Integration

```typescript
// Automatic token inclusion in requests
const tasks = await taskApi.getAll();

// Handle authentication errors
try {
  const profile = await authApi.getProfile(token);
} catch (error) {
  // Redirect to login on auth failure
}
```

## Error Handling

### Common Error Responses

```json
// Invalid credentials
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}

// Token expired
{
  "error": "Token expired",
  "message": "Your session has expired. Please log in again"
}

// Validation failed
{
  "error": "Validation failed",
  "message": "Please check your input",
  "details": [...]
}
```

## Testing Authentication

### Manual Testing

1. **Register a new user**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "TestPass123"
     }'
   ```

2. **Login**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "TestPass123"
     }'
   ```

3. **Access protected endpoint**:
   ```bash
   curl -X GET http://localhost:5000/api/tasks \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

## Production Considerations

### Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong JWT secret
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Set up monitoring
- [ ] Regular security audits

### Performance Optimization

- [ ] Add database indexes for user queries
- [ ] Implement token caching
- [ ] Optimize password hashing rounds
- [ ] Add connection pooling

### Monitoring

- [ ] Track authentication attempts
- [ ] Monitor token usage
- [ ] Log security events
- [ ] Set up alerts for suspicious activity

## Troubleshooting

### Common Issues

1. **Token not being sent**: Check localStorage and request headers
2. **401 errors**: Verify token validity and expiration
3. **CORS issues**: Ensure CORS_ORIGIN is set correctly
4. **Database connection**: Verify MongoDB connection string

### Debug Commands

```bash
# Check server logs
cd server && pnpm dev

# Test authentication endpoint
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Verify MongoDB connection
mongosh --eval "db.runCommand('ping')"
```

## Next Steps

### Planned Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Social login integration
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Role-based access control

### Integration Points

- [ ] Frontend authentication UI
- [ ] Protected route components
- [ ] User profile management
- [ ] Settings and preferences
- [ ] Analytics and statistics

## Support

For authentication issues:
1. Check server logs for detailed error messages
2. Verify environment variables are set correctly
3. Test endpoints with curl or Postman
4. Ensure MongoDB is running and accessible 
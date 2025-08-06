# Authentication Setup Guide

This guide will help you configure authentication for your Clarity Cycle Hub application.

## Quick Start

1. Copy the environment template:
   ```bash
   cp server/env.example server/.env
   ```

2. Edit `server/.env` with your configuration values

3. Start the server - it will validate your configuration automatically

## Environment Variables

### Required Variables

These variables must be set for the application to work:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Security Configuration
SESSION_SECRET=your-session-secret-key
COOKIE_SECRET=your-cookie-secret-key
```

### Auth0 Configuration (Optional)

#### Setting up Auth0
1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new application or select existing one
3. Configure your application settings:
   - **Application Type**: Single Page Application (for frontend) or Regular Web Application (for backend)
   - **Allowed Callback URLs**: `http://localhost:5000/api/auth/auth0/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Create an API in Auth0:
   - **Name**: Clarity Cycle Hub API
   - **Identifier**: `https://your-api-identifier`
   - **Signing Algorithm**: RS256
5. Add to your `.env`:
   ```env
   AUTH0_DOMAIN=your-tenant.auth0.com
   AUTH0_CLIENT_ID=your-auth0-client-id
   AUTH0_CLIENT_SECRET=your-auth0-client-secret
   AUTH0_CALLBACK_URL=http://localhost:5000/api/auth/auth0/callback
   AUTH0_AUDIENCE=https://your-api-identifier
   AUTH0_ISSUER=https://your-tenant.auth0.com/
   ```

#### Auth0 Social Connections (Optional)
You can enable social login providers through Auth0:
1. In Auth0 Dashboard, go to **Authentication** → **Social**
2. Enable providers like Google, GitHub, Microsoft, etc.
3. Configure each provider with their respective credentials
4. Users can then sign in with any enabled social provider through Auth0

### Email Configuration (Optional)

For password reset and email verification:

```env
# Gmail Example
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

**Note for Gmail**: You'll need to generate an "App Password" in your Google Account settings.

### Security Configuration

```env
# Password hashing strength (10-12 recommended)
BCRYPT_ROUNDS=12

# Rate limiting (15 minutes window, 100 requests max)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Password policy
MIN_PASSWORD_LENGTH=8
REQUIRE_UPPERCASE=true
REQUIRE_LOWERCASE=true
REQUIRE_NUMBERS=true
REQUIRE_SPECIAL_CHARS=false

# Account security
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=15
REQUIRE_EMAIL_VERIFICATION=false
REQUIRE_TWO_FACTOR=false

# Session configuration
SESSION_COOKIE_SECURE=false  # Set to true in production
SESSION_COOKIE_HTTPONLY=true
SESSION_COOKIE_SAMESITE=lax
SESSION_MAX_AGE=604800000  # 7 days in milliseconds
```

## Configuration Validation

The server automatically validates your configuration on startup. You can also check it manually:

```bash
# Start the server to see validation results
npm run dev

# Or check the config endpoint
curl http://localhost:5000/api/config
```

## Production Checklist

Before deploying to production:

- [ ] Change all default secrets (JWT_SECRET, SESSION_SECRET, etc.)
- [ ] Set SESSION_COOKIE_SECURE=true
- [ ] Configure proper CORS_ORIGIN
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS URLs for OAuth callbacks
- [ ] Configure email service
- [ ] Review rate limiting settings
- [ ] Test all OAuth providers

## Troubleshooting

### Common Issues

1. **"JWT_SECRET not configured"**
   - Make sure JWT_SECRET is set in your .env file
   - Don't use the default value in production

2. **"Email configuration test failed"**
   - Check SMTP settings
   - For Gmail, use App Password instead of regular password
   - Verify firewall/network settings

3. **"Auth0 not working"**
   - Check Auth0 domain, client ID, and client secret
   - Verify callback URL matches exactly
   - Ensure Auth0 application is properly configured
   - Check API audience and issuer settings

4. **"Rate limit exceeded"**
   - Adjust RATE_LIMIT_MAX_REQUESTS if needed
   - Check if you're making too many requests

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=auth:*
```

## Security Best Practices

1. **Secrets Management**
   - Never commit .env files to version control
   - Use environment variables in production
   - Rotate secrets regularly

2. **Password Policy**
   - Require strong passwords
   - Enable email verification
   - Consider two-factor authentication

3. **Rate Limiting**
   - Set appropriate limits for your use case
   - Monitor for abuse

4. **Session Security**
   - Use secure cookies in production
   - Set appropriate session timeouts
   - Implement session invalidation

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `DELETE /api/auth/account` - Delete account

### Auth0 Endpoints (if configured)
- `GET /api/auth/auth0` - Auth0 login
- `GET /api/auth/auth0/callback` - Auth0 callback
- `POST /api/auth/auth0/token` - Auth0 token validation

### Configuration Endpoints
- `GET /api/health` - Health check
- `GET /api/config` - Configuration summary

## Support

If you encounter issues:

1. Check the server logs for error messages
2. Verify your environment variables
3. Test individual components (email, OAuth, etc.)
4. Check the configuration validation output

For additional help, refer to the main README.md file. 
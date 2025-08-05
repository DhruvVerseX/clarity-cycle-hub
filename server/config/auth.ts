/**
 * Authentication Configuration
 * Centralized configuration for all authentication providers and settings
 */

export interface AuthConfig {
  // JWT Configuration
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  
  // Auth0 Configuration
  auth0: {
    domain: string;
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    audience: string;
    issuer: string;
    enabled: boolean;
  };
  
  // Email Configuration
  email: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
    enabled: boolean;
  };
  
  // Security Configuration
  security: {
    bcryptRounds: number;
    sessionSecret: string;
    cookieSecret: string;
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
  };
  
  // Password Policy
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  
  // Account Security
  accountSecurity: {
    maxLoginAttempts: number;
    lockoutDurationMinutes: number;
    requireEmailVerification: boolean;
    requireTwoFactor: boolean;
  };
  
  // Session Configuration
  session: {
    cookieSecure: boolean;
    cookieHttpOnly: boolean;
    cookieSameSite: 'lax' | 'strict' | 'none';
    maxAge: number;
  };
  
  // API Configuration
  api: {
    version: string;
    prefix: string;
  };
}

/**
 * Load authentication configuration from environment variables
 */
export const loadAuthConfig = (): AuthConfig => {
  const config: AuthConfig = {
    jwt: {
      secret: process.env.JWT_SECRET || 'fallback-jwt-secret-change-in-production',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-in-production',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
    
    auth0: {
      domain: process.env.AUTH0_DOMAIN || '',
      clientId: process.env.AUTH0_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
      callbackUrl: process.env.AUTH0_CALLBACK_URL || 'http://localhost:5000/api/auth/auth0/callback',
      audience: process.env.AUTH0_AUDIENCE || '',
      issuer: process.env.AUTH0_ISSUER || '',
      enabled: !!(process.env.AUTH0_DOMAIN && process.env.AUTH0_CLIENT_ID && process.env.AUTH0_CLIENT_SECRET),
    },
    
    email: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      from: process.env.SMTP_FROM || 'noreply@yourdomain.com',
      enabled: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    },
    
    security: {
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
      sessionSecret: process.env.SESSION_SECRET || 'fallback-session-secret-change-in-production',
      cookieSecret: process.env.COOKIE_SECRET || 'fallback-cookie-secret-change-in-production',
      rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
      rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
    
    passwordPolicy: {
      minLength: parseInt(process.env.MIN_PASSWORD_LENGTH || '8', 10),
      requireUppercase: process.env.REQUIRE_UPPERCASE === 'true',
      requireLowercase: process.env.REQUIRE_LOWERCASE === 'true',
      requireNumbers: process.env.REQUIRE_NUMBERS === 'true',
      requireSpecialChars: process.env.REQUIRE_SPECIAL_CHARS === 'true',
    },
    
    accountSecurity: {
      maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
      lockoutDurationMinutes: parseInt(process.env.LOCKOUT_DURATION_MINUTES || '15', 10),
      requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === 'true',
      requireTwoFactor: process.env.REQUIRE_TWO_FACTOR === 'true',
    },
    
    session: {
      cookieSecure: process.env.SESSION_COOKIE_SECURE === 'true',
      cookieHttpOnly: process.env.SESSION_COOKIE_HTTPONLY !== 'false',
      cookieSameSite: (process.env.SESSION_COOKIE_SAMESITE as 'lax' | 'strict' | 'none') || 'lax',
      maxAge: parseInt(process.env.SESSION_MAX_AGE || '604800000', 10),
    },
    
    api: {
      version: process.env.API_VERSION || 'v1',
      prefix: process.env.API_PREFIX || '/api',
    },
  };
  
  return config;
};

/**
 * Validate authentication configuration
 */
export const validateAuthConfig = (config: AuthConfig): string[] => {
  const errors: string[] = [];
  
  // Check required JWT configuration
  if (!config.jwt.secret || config.jwt.secret === 'fallback-jwt-secret-change-in-production') {
    errors.push('JWT_SECRET is required and must be changed from default');
  }
  
  if (!config.jwt.refreshSecret || config.jwt.refreshSecret === 'fallback-refresh-secret-change-in-production') {
    errors.push('JWT_REFRESH_SECRET is required and must be changed from default');
  }
  
  // Check security configuration
  if (!config.security.sessionSecret || config.security.sessionSecret === 'fallback-session-secret-change-in-production') {
    errors.push('SESSION_SECRET is required and must be changed from default');
  }
  
  if (!config.security.cookieSecret || config.security.cookieSecret === 'fallback-cookie-secret-change-in-production') {
    errors.push('COOKIE_SECRET is required and must be changed from default');
  }
  
  // Validate password policy
  if (config.passwordPolicy.minLength < 6) {
    errors.push('MIN_PASSWORD_LENGTH must be at least 6');
  }
  
  // Validate rate limiting
  if (config.security.rateLimitMaxRequests < 1) {
    errors.push('RATE_LIMIT_MAX_REQUESTS must be at least 1');
  }
  
  if (config.security.rateLimitWindowMs < 1000) {
    errors.push('RATE_LIMIT_WINDOW_MS must be at least 1000ms');
  }
  
  return errors;
};

/**
 * Check if Auth0 is enabled
 */
export const isAuth0Enabled = (config: AuthConfig): boolean => {
  return config.auth0.enabled;
};

/**
 * Get Auth0 configuration
 */
export const getAuth0Config = (config: AuthConfig) => {
  return config.auth0;
};

// Export singleton instance
export const authConfig = loadAuthConfig(); 
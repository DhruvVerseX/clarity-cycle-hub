/**
 * Configuration Validation
 * Validates all authentication and server configuration on startup
 */

import { authConfig, validateAuthConfig, isAuth0Enabled, getAuth0Config } from "./auth.js";
import { testEmailConfiguration } from "../utils/email.js";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

/**
 * Validate all configuration
 */
export const validateConfiguration = async (): Promise<ValidationResult> => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    info: []
  };

  // Validate authentication configuration
  const authErrors = validateAuthConfig(authConfig);
  if (authErrors.length > 0) {
    result.errors.push(...authErrors);
    result.isValid = false;
  }

  // Check Auth0 configuration
  if (isAuth0Enabled(authConfig)) {
    result.info.push('Auth0 is configured and enabled');
  } else {
    result.warnings.push('Auth0 is not configured. Users will only be able to register with email/password.');
  }

  // Check email configuration
  if (authConfig.email.enabled) {
    result.info.push('Email service is configured');
    
    // Test email configuration
    try {
      const emailTestResult = await testEmailConfiguration();
      if (emailTestResult) {
        result.info.push('Email configuration test passed');
      } else {
        result.warnings.push('Email configuration test failed - emails may not be sent');
      }
    } catch (error) {
      result.warnings.push(`Email configuration test failed: ${error}`);
    }
  } else {
    result.warnings.push('Email service is not configured. Password reset and email verification will not work.');
  }

  // Check security settings
  if (authConfig.security.bcryptRounds < 10) {
    result.warnings.push('BCRYPT_ROUNDS is set to less than 10, which may be insecure');
  }

  if (authConfig.passwordPolicy.minLength < 8) {
    result.warnings.push('MIN_PASSWORD_LENGTH is set to less than 8 characters');
  }

  if (authConfig.accountSecurity.maxLoginAttempts > 10) {
    result.warnings.push('MAX_LOGIN_ATTEMPTS is set very high, consider reducing for security');
  }

  // Check environment-specific settings
  if (process.env.NODE_ENV === 'production') {
    if (!authConfig.session.cookieSecure) {
      result.warnings.push('SESSION_COOKIE_SECURE should be true in production');
    }
    
    if (authConfig.jwt.secret === 'fallback-jwt-secret-change-in-production') {
      result.errors.push('JWT_SECRET must be changed from default in production');
      result.isValid = false;
    }
    
    if (authConfig.security.sessionSecret === 'fallback-session-secret-change-in-production') {
      result.errors.push('SESSION_SECRET must be changed from default in production');
      result.isValid = false;
    }
  }

  // Check rate limiting configuration
  if (authConfig.security.rateLimitMaxRequests > 1000) {
    result.warnings.push('RATE_LIMIT_MAX_REQUESTS is set very high, consider reducing for security');
  }

  if (authConfig.security.rateLimitWindowMs < 60000) {
    result.warnings.push('RATE_LIMIT_WINDOW_MS is set very low, consider increasing');
  }

  return result;
};

/**
 * Print configuration validation results
 */
export const printValidationResults = (result: ValidationResult): void => {
  console.log('\n🔧 Configuration Validation Results:');
  console.log('=====================================');
  
  if (result.isValid) {
    console.log('✅ Configuration is valid');
  } else {
    console.log('❌ Configuration has errors');
  }
  
  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  if (result.info.length > 0) {
    console.log('\nℹ️  Info:');
    result.info.forEach(info => console.log(`  - ${info}`));
  }
  
  console.log('\n');
};

/**
 * Validate and exit if configuration is invalid
 */
export const validateAndExit = async (): Promise<void> => {
  const result = await validateConfiguration();
  printValidationResults(result);
  
  if (!result.isValid) {
    console.error('❌ Server startup aborted due to configuration errors');
    process.exit(1);
  }
  
  if (result.warnings.length > 0) {
    console.log('⚠️  Server will start with warnings. Please review configuration.');
  }
};

/**
 * Get configuration summary for API endpoint
 */
export const getConfigurationSummary = () => {
  const auth0Config = getAuth0Config(authConfig);
  
  return {
    auth0: {
      enabled: isAuth0Enabled(authConfig),
      configured: {
        domain: auth0Config.domain,
        clientId: auth0Config.clientId ? '***configured***' : 'not configured',
        clientSecret: auth0Config.clientSecret ? '***configured***' : 'not configured',
        callbackUrl: auth0Config.callbackUrl,
        audience: auth0Config.audience,
        issuer: auth0Config.issuer,
      }
    },
    email: {
      enabled: authConfig.email.enabled,
      configured: authConfig.email.enabled
    },
    security: {
      passwordPolicy: {
        minLength: authConfig.passwordPolicy.minLength,
        requireUppercase: authConfig.passwordPolicy.requireUppercase,
        requireLowercase: authConfig.passwordPolicy.requireLowercase,
        requireNumbers: authConfig.passwordPolicy.requireNumbers,
        requireSpecialChars: authConfig.passwordPolicy.requireSpecialChars,
      },
      accountSecurity: {
        maxLoginAttempts: authConfig.accountSecurity.maxLoginAttempts,
        lockoutDurationMinutes: authConfig.accountSecurity.lockoutDurationMinutes,
        requireEmailVerification: authConfig.accountSecurity.requireEmailVerification,
        requireTwoFactor: authConfig.accountSecurity.requireTwoFactor,
      },
      rateLimiting: {
        windowMs: authConfig.security.rateLimitWindowMs,
        maxRequests: authConfig.security.rateLimitMaxRequests,
      }
    },
    session: {
      cookieSecure: authConfig.session.cookieSecure,
      cookieHttpOnly: authConfig.session.cookieHttpOnly,
      cookieSameSite: authConfig.session.cookieSameSite,
      maxAge: authConfig.session.maxAge,
    }
  };
}; 
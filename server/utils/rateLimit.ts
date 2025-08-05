/**
 * Rate Limiting Utilities
 * Provides rate limiting middleware for authentication endpoints
 */

import { Request, Response, NextFunction } from "express";
import { authConfig } from "../config/auth.js";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore: RateLimitStore = {};

/**
 * Create rate limiting middleware
 */
export const createRateLimit = (
  windowMs: number = authConfig.security.rateLimitWindowMs,
  maxRequests: number = authConfig.security.rateLimitMaxRequests,
  keyGenerator?: (req: Request) => string
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator ? keyGenerator(req) : req.ip;
    const now = Date.now();
    
    // Get or create rate limit entry
    if (!rateLimitStore[key] || now > rateLimitStore[key].resetTime) {
      rateLimitStore[key] = {
        count: 0,
        resetTime: now + windowMs
      };
    }
    
    // Increment request count
    rateLimitStore[key].count++;
    
    // Check if limit exceeded
    if (rateLimitStore[key].count > maxRequests) {
      const retryAfter = Math.ceil((rateLimitStore[key].resetTime - now) / 1000);
      
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(rateLimitStore[key].resetTime).toISOString(),
        'Retry-After': retryAfter.toString()
      });
      
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
        retryAfter
      });
    }
    
    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': (maxRequests - rateLimitStore[key].count).toString(),
      'X-RateLimit-Reset': new Date(rateLimitStore[key].resetTime).toISOString()
    });
    
    next();
  };
};

/**
 * Rate limit for authentication endpoints
 */
export const authRateLimit = createRateLimit(
  authConfig.security.rateLimitWindowMs,
  Math.floor(authConfig.security.rateLimitMaxRequests / 2), // Stricter for auth
  (req: Request) => `auth:${req.ip}`
);

/**
 * Rate limit for login attempts
 */
export const loginRateLimit = createRateLimit(
  authConfig.security.rateLimitWindowMs,
  Math.floor(authConfig.security.rateLimitMaxRequests / 4), // Even stricter for login
  (req: Request) => `login:${req.ip}`
);

/**
 * Rate limit for registration
 */
export const registrationRateLimit = createRateLimit(
  authConfig.security.rateLimitWindowMs,
  Math.floor(authConfig.security.rateLimitMaxRequests / 4), // Strict for registration
  (req: Request) => `register:${req.ip}`
);

/**
 * Rate limit for password reset
 */
export const passwordResetRateLimit = createRateLimit(
  authConfig.security.rateLimitWindowMs,
  Math.floor(authConfig.security.rateLimitMaxRequests / 8), // Very strict for password reset
  (req: Request) => `password-reset:${req.ip}`
);

/**
 * Clean up expired rate limit entries
 */
export const cleanupRateLimitStore = () => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (now > rateLimitStore[key].resetTime) {
      delete rateLimitStore[key];
    }
  });
};

// Clean up expired entries every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000); 
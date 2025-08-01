/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

/**
 * Extended Request interface with user property
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

/**
 * JWT token payload interface
 */
interface TokenPayload {
  id: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Verify JWT token and attach user to request
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        error: "Access token required",
        message: "Please provide a valid authentication token"
      });
      return;
    }

    // Verify token
    const secret = process.env["JWT_SECRET"];
    if (!secret) {
      console.error("JWT_SECRET not configured");
      res.status(500).json({ 
        error: "Server configuration error",
        message: "Authentication service not properly configured"
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;
    
    // Check if user still exists in database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({ 
        error: "Invalid token",
        message: "User no longer exists"
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ 
        error: "Account deactivated",
        message: "Your account has been deactivated"
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: (user._id as any).toString(),
      username: user.username,
      email: user.email
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        error: "Invalid token",
        message: "The provided token is invalid or expired"
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: "Token expired",
        message: "Your session has expired. Please log in again"
      });
    } else {
      console.error("Authentication error:", error);
      res.status(500).json({ 
        error: "Authentication error",
        message: "An error occurred during authentication"
      });
    }
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      next();
      return;
    }

    const secret = process.env["JWT_SECRET"];
    if (!secret) {
      next();
      return;
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;
    const user = await User.findById(decoded.id).select("-password");
    
    if (user && user.isActive) {
      req.user = {
        id: (user._id as any).toString(),
        username: user.username,
        email: user.email
      };
    }

    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};

/**
 * Check if user has required role (for future role-based access)
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: "Authentication required",
        message: "You must be logged in to access this resource"
      });
      return;
    }

    // For now, all authenticated users have access
    // In the future, you can add role checking here
    next();
  };
};

/**
 * Generate JWT token for user
 */
export const generateToken = (user: {
  _id: string;
  username: string;
  email: string;
}): string => {
  const secret = process.env["JWT_SECRET"];
  if (!secret) {
    throw new Error("JWT_SECRET not configured");
  }

  const payload: Omit<TokenPayload, "iat" | "exp"> = {
    id: user._id.toString(),
    username: user.username,
    email: user.email
  };

  return jwt.sign(payload, secret, {
    expiresIn: process.env["JWT_EXPIRES_IN"] || "7d"
  } as jwt.SignOptions);
};

/**
 * Refresh token (for future implementation)
 */
export const refreshToken = (token: string): string | null => {
  try {
    const secret = process.env["JWT_SECRET"];
    if (!secret) return null;

    const decoded = jwt.verify(token, secret, { ignoreExpiration: true }) as TokenPayload;
    
    // Generate new token with same payload but new expiration
    return jwt.sign(
      {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email
      },
      secret,
      { expiresIn: process.env["JWT_EXPIRES_IN"] || "7d" } as jwt.SignOptions
    );
  } catch (error) {
    return null;
  }
}; 
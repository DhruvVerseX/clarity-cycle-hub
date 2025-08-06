/**
 * Password Utilities
 * Handles password validation, hashing, and verification
 */

import bcrypt from "bcryptjs";
import { authConfig } from "../config/auth.js";

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate password against configured policy
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  const { passwordPolicy } = authConfig;
  
  // Check minimum length
  if (password.length < passwordPolicy.minLength) {
    errors.push(`Password must be at least ${passwordPolicy.minLength} characters long`);
  }
  
  // Check for uppercase letters
  if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  // Check for lowercase letters
  if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  // Check for numbers
  if (passwordPolicy.requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Check for special characters
  if (passwordPolicy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Hash password using configured bcrypt rounds
 */
export const hashPassword = async (password: string): Promise<string> => {
  const { security } = authConfig;
  return await bcrypt.hash(password, security.bcryptRounds);
};

/**
 * Verify password against hash
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate a secure random password
 */
export const generateSecurePassword = (length: number = 16): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  // Ensure at least one character from each required category
  if (authConfig.passwordPolicy.requireLowercase) {
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  }
  
  if (authConfig.passwordPolicy.requireUppercase) {
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  }
  
  if (authConfig.passwordPolicy.requireNumbers) {
    password += "0123456789"[Math.floor(Math.random() * 10)];
  }
  
  if (authConfig.passwordPolicy.requireSpecialChars) {
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)];
  }
  
  // Fill the rest with random characters
  while (password.length < length) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Check password strength score (0-4)
 * 0: Very weak
 * 1: Weak
 * 2: Fair
 * 3: Good
 * 4: Strong
 */
export const getPasswordStrength = (password: string): number => {
  let score = 0;
  
  // Length bonus
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character variety bonus
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
  
  // Penalty for common patterns
  if (/(.)\1{2,}/.test(password)) score--; // Repeated characters
  if (/123|abc|qwe/i.test(password)) score--; // Common sequences
  
  return Math.max(0, Math.min(4, score));
};

/**
 * Get password strength description
 */
export const getPasswordStrengthDescription = (strength: number): string => {
  switch (strength) {
    case 0: return "Very Weak";
    case 1: return "Weak";
    case 2: return "Fair";
    case 3: return "Good";
    case 4: return "Strong";
    default: return "Unknown";
  }
}; 
/**
 * Authentication Routes
 * Handles user registration, login, and profile management
 */

import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { User } from "../models/User.js";
import { generateToken, authenticateToken, AuthRequest } from "../middleware/auth.js";

const router: Router = Router();

/**
 * User registration
 * POST /api/auth/register
 */
router.post("/register", [
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, and hyphens")
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error("Username already exists");
      }
      return true;
    }),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error("Email already registered");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  body("firstName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters"),
  body("lastName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters")
], async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Please check your input",
        details: errors.array()
      });
    }

    const { username, email, password, firstName, lastName } = req.body;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      stats: {
        totalPomodoros: 0,
        totalTasks: 0,
        totalCompletedTasks: 0,
        totalFocusTime: 0,
        currentStreak: 0,
        longestStreak: 0
      },
      preferences: {
        defaultPomodoroDuration: 25,
        defaultBreakDuration: 5,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        soundEnabled: true,
        notificationsEnabled: true,
        theme: "system"
      }
    });

    await user.save();

    // Generate token
    const token = generateToken({
      _id: user._id as any,
      username: user.username,
      email: user.email
    });

    // Return user data (without password)
    const userResponse = {
      id: user._id as any,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      preferences: user.preferences,
      stats: user.stats,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userResponse
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      message: "An error occurred during registration"
    });
  }
});

/**
 * User login
 * POST /api/auth/login
 */
router.post("/login", [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
], async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Please check your input",
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect"
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        error: "Account deactivated",
        message: "Your account has been deactivated"
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect"
      });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      _id: user._id as any,
      username: user.username,
      email: user.email
    });

    // Return user data (without password)
    const userResponse = {
      id: user._id as any,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      preferences: user.preferences,
      stats: user.stats,
      createdAt: user.createdAt
    };

    res.json({
      message: "Login successful",
      token,
      user: userResponse
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      message: "An error occurred during login"
    });
  }
});

/**
 * Get current user profile
 * GET /api/auth/profile
 */
router.get("/profile", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select("-password");
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User profile not found"
      });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        preferences: user.preferences,
        stats: user.stats,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      error: "Profile fetch failed",
      message: "An error occurred while fetching profile"
    });
  }
});

/**
 * Update user profile
 * PUT /api/auth/profile
 */
router.put("/profile", [
  authenticateToken,
  body("firstName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters"),
  body("lastName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters"),
  body("avatar")
    .optional()
    .isURL()
    .withMessage("Avatar must be a valid URL"),
  body("preferences.defaultPomodoroDuration")
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage("Default pomodoro duration must be between 1 and 120 minutes"),
  body("preferences.defaultBreakDuration")
    .optional()
    .isInt({ min: 1, max: 60 })
    .withMessage("Default break duration must be between 1 and 60 minutes"),
  body("preferences.theme")
    .optional()
    .isIn(["light", "dark", "system"])
    .withMessage("Theme must be light, dark, or system")
], async (req: AuthRequest, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Please check your input",
        details: errors.array()
      });
    }

    const { firstName, lastName, avatar, preferences } = req.body;

    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User profile not found"
      });
    }

    // Update fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (avatar !== undefined) user.avatar = avatar;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    // Return updated user data (without password)
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      preferences: user.preferences,
      stats: user.stats,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      message: "Profile updated successfully",
      user: userResponse
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      error: "Profile update failed",
      message: "An error occurred while updating profile"
    });
  }
});

/**
 * Change password
 * PUT /api/auth/change-password
 */
router.put("/change-password", [
  authenticateToken,
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("New password must contain at least one uppercase letter, one lowercase letter, and one number")
], async (req: AuthRequest, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Please check your input",
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User profile not found"
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: "Invalid current password",
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedNewPassword;

    await user.save();

    res.json({
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      error: "Password change failed",
      message: "An error occurred while changing password"
    });
  }
});

/**
 * Delete account
 * DELETE /api/auth/account
 */
router.delete("/account", [
  authenticateToken,
  body("password")
    .notEmpty()
    .withMessage("Password is required for account deletion")
], async (req: AuthRequest, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Please check your input",
        details: errors.array()
      });
    }

    const { password } = req.body;

    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User profile not found"
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password",
        message: "Password is incorrect"
      });
    }

    // Deactivate account instead of deleting
    user.isActive = false;
    await user.save();

    res.json({
      message: "Account deactivated successfully"
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({
      error: "Account deletion failed",
      message: "An error occurred while deleting account"
    });
  }
});

export default router; 
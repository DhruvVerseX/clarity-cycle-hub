/**
 * User Model Schema
 * Defines the structure for user documents in MongoDB
 */

import mongoose, { Document, Schema } from "mongoose";

/**
 * User document interface
 */
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  preferences: {
    defaultPomodoroDuration: number;
    defaultBreakDuration: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    theme: "light" | "dark" | "system";
  };
  stats: {
    totalPomodoros: number;
    totalTasks: number;
    totalCompletedTasks: number;
    totalFocusTime: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate?: Date;
  };
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  updateStats(): Promise<IUser>;
  incrementStreak(): Promise<IUser>;
  resetStreak(): Promise<IUser>;
}

/**
 * User model interface with static methods
 */
export interface IUserModel extends mongoose.Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findActiveUsers(): Promise<IUser[]>;
}

/**
 * User schema definition
 */
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"]
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"]
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"]
    },
    avatar: {
      type: String,
      trim: true
    },
    preferences: {
      defaultPomodoroDuration: {
        type: Number,
        min: [1, "Default pomodoro duration must be at least 1 minute"],
        max: [120, "Default pomodoro duration cannot exceed 120 minutes"],
        default: 25
      },
      defaultBreakDuration: {
        type: Number,
        min: [1, "Default break duration must be at least 1 minute"],
        max: [60, "Default break duration cannot exceed 60 minutes"],
        default: 5
      },
      autoStartBreaks: {
        type: Boolean,
        default: false
      },
      autoStartPomodoros: {
        type: Boolean,
        default: false
      },
      soundEnabled: {
        type: Boolean,
        default: true
      },
      notificationsEnabled: {
        type: Boolean,
        default: true
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system"
      }
    },
    stats: {
      totalPomodoros: {
        type: Number,
        min: [0, "Total pomodoros cannot be negative"],
        default: 0
      },
      totalTasks: {
        type: Number,
        min: [0, "Total tasks cannot be negative"],
        default: 0
      },
      totalCompletedTasks: {
        type: Number,
        min: [0, "Total completed tasks cannot be negative"],
        default: 0
      },
      totalFocusTime: {
        type: Number,
        min: [0, "Total focus time cannot be negative"],
        default: 0
      },
      currentStreak: {
        type: Number,
        min: [0, "Current streak cannot be negative"],
        default: 0
      },
      longestStreak: {
        type: Number,
        min: [0, "Longest streak cannot be negative"],
        default: 0
      },
      lastActiveDate: {
        type: Date
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual for full name
 */
userSchema.virtual("fullName").get(function(this: IUser) {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || this.username;
});

/**
 * Virtual for completion rate
 */
userSchema.virtual("completionRate").get(function(this: IUser) {
  if (this.stats.totalTasks === 0) return 0;
  return Math.round((this.stats.totalCompletedTasks / this.stats.totalTasks) * 100);
});

/**
 * Virtual for average focus time per pomodoro
 */
userSchema.virtual("averageFocusTime").get(function(this: IUser) {
  if (this.stats.totalPomodoros === 0) return 0;
  return Math.round(this.stats.totalFocusTime / this.stats.totalPomodoros);
});

/**
 * Indexes for better query performance
 * Note: email and username indexes are automatically created by unique: true
 */
userSchema.index({ "stats.lastActiveDate": -1 });
userSchema.index({ "stats.currentStreak": -1 });

/**
 * Pre-save middleware to validate data
 */
userSchema.pre("save", function(next) {
  // Ensure stats don't have negative values
  if (this.stats.totalCompletedTasks > this.stats.totalTasks) {
    this.stats.totalCompletedTasks = this.stats.totalTasks;
  }
  
  // Update longest streak if current streak is longer
  if (this.stats.currentStreak > this.stats.longestStreak) {
    this.stats.longestStreak = this.stats.currentStreak;
  }
  
  next();
});

/**
 * Static method to find user by email
 */
userSchema.statics["findByEmail"] = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Static method to find user by username
 */
userSchema.statics["findByUsername"] = function(username: string) {
  return this.findOne({ username });
};

/**
 * Static method to find active users
 */
userSchema.statics["findActiveUsers"] = function() {
  return this.find({ isActive: true });
};

/**
 * Instance method to update user stats
 */
userSchema.methods["updateStats"] = function() {
  this["stats"].lastActiveDate = new Date();
  return this["save"]();
};

/**
 * Instance method to increment streak
 */
userSchema.methods["incrementStreak"] = function() {
  this["stats"].currentStreak += 1;
  if (this["stats"].currentStreak > this["stats"].longestStreak) {
    this["stats"].longestStreak = this["stats"].currentStreak;
  }
  return this["save"]();
};

/**
 * Instance method to reset streak
 */
userSchema.methods["resetStreak"] = function() {
  this["stats"].currentStreak = 0;
  return this["save"]();
};

export const User = mongoose.model<IUser, IUserModel>("User", userSchema); 
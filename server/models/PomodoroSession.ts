/**
 * Pomodoro Session Model Schema
 * Defines the structure for pomodoro session documents in MongoDB
 */

import mongoose, { Document, Schema } from "mongoose";

/**
 * Pomodoro session document interface
 */
export interface IPomodoroSession extends Document {
  duration: number;
  taskId?: mongoose.Types.ObjectId;
  completed: boolean;
  startTime: Date;
  endTime?: Date;
  notes?: string;
  interruptions?: number;
  breakDuration?: number;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual properties
  durationMinutes: number;
  actualDuration: number;
  efficiency: number;
  status: string;
  
  // Instance methods
  completeSession(notes?: string): Promise<IPomodoroSession>;
  interruptSession(): Promise<IPomodoroSession>;
  addBreakTime(minutes: number): Promise<IPomodoroSession>;
}

/**
 * Pomodoro session model interface with static methods
 */
export interface IPomodoroSessionModel extends mongoose.Model<IPomodoroSession> {
  findByTask(taskId: string): Promise<IPomodoroSession[]>;
  findCompleted(): Promise<IPomodoroSession[]>;
  findToday(): Promise<IPomodoroSession[]>;
}

/**
 * Pomodoro session schema definition
 */
const pomodoroSessionSchema = new Schema<IPomodoroSession>(
  {
    duration: {
      type: Number,
      required: [true, "Session duration is required"],
      min: [1, "Duration must be at least 1 minute"],
      max: [120, "Duration cannot exceed 120 minutes"],
      validate: {
        validator: function(value: number) {
          return value > 0 && value <= 120;
        },
        message: "Duration must be between 1 and 120 minutes"
      }
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: false
    },
    completed: {
      type: Boolean,
      default: false,
      required: true
    },
    startTime: {
      type: Date,
      default: Date.now,
      required: true
    },
    endTime: {
      type: Date,
      validate: {
        validator: function(this: IPomodoroSession, value: Date) {
          if (value && this.startTime && value < this.startTime) {
            return false;
          }
          return true;
        },
        message: "End time cannot be before start time"
      }
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"]
    },
    interruptions: {
      type: Number,
      min: [0, "Interruptions cannot be negative"],
      default: 0
    },
    breakDuration: {
      type: Number,
      min: [0, "Break duration cannot be negative"],
      max: [60, "Break duration cannot exceed 60 minutes"],
      default: 0
    },
    userId: {
      type: String,
      required: false // Will be required when authentication is fully implemented
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual for session duration in minutes
 */
pomodoroSessionSchema.virtual("durationMinutes").get(function(this: IPomodoroSession) {
  return Math.round(this.duration / 60);
});

/**
 * Virtual for actual duration (including breaks)
 */
pomodoroSessionSchema.virtual("actualDuration").get(function(this: IPomodoroSession) {
  if (!this.endTime || !this.startTime) {
    return this.duration;
  }
  return Math.round((this.endTime.getTime() - this.startTime.getTime()) / 1000 / 60);
});

/**
 * Virtual for efficiency percentage
 */
pomodoroSessionSchema.virtual("efficiency").get(function(this: IPomodoroSession) {
  if (!this.completed || !this.endTime) {
    return 0;
  }
  const actualDuration = this.actualDuration;
  if (actualDuration === 0) return 0;
  return Math.min((this.duration / actualDuration) * 100, 100);
});

/**
 * Virtual for session status
 */
pomodoroSessionSchema.virtual("status").get(function(this: IPomodoroSession) {
  if (this.completed) return "completed";
  if (this.endTime) return "interrupted";
  return "active";
});

/**
 * Indexes for better query performance
 */
pomodoroSessionSchema.index({ taskId: 1, startTime: -1 });
pomodoroSessionSchema.index({ completed: 1, startTime: -1 });
pomodoroSessionSchema.index({ startTime: 1 });
pomodoroSessionSchema.index({ "duration": 1, "completed": 1 });

/**
 * Pre-save middleware to validate data
 */
pomodoroSessionSchema.pre("save", function(next) {
  // Auto-set end time if completed
  if (this.completed && !this.endTime) {
    this.endTime = new Date();
  }
  
  // Validate break duration
  if (this.breakDuration && this.breakDuration > this.duration) {
    this.breakDuration = this.duration;
  }
  
  next();
});

/**
 * Static method to get sessions by task
 */
pomodoroSessionSchema.statics["findByTask"] = function(taskId: string) {
  return this.find({ taskId }).populate("taskId", "title description");
};

/**
 * Static method to get completed sessions
 */
pomodoroSessionSchema.statics["findCompleted"] = function() {
  return this.find({ completed: true }).populate("taskId", "title");
};

/**
 * Static method to get today's sessions
 */
pomodoroSessionSchema.statics["findToday"] = function() {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  
  return this.find({
    startTime: { $gte: startOfDay, $lte: endOfDay }
  }).populate("taskId", "title");
};

/**
 * Instance method to complete session
 */
pomodoroSessionSchema.methods["completeSession"] = function(notes?: string) {
  this["completed"] = true;
  this["endTime"] = new Date();
  if (notes) {
    this["notes"] = notes;
  }
  return this["save"]();
};

/**
 * Instance method to interrupt session
 */
pomodoroSessionSchema.methods["interruptSession"] = function() {
  this["endTime"] = new Date();
  this["interruptions"] += 1;
  return this["save"]();
};

/**
 * Instance method to add break time
 */
pomodoroSessionSchema.methods["addBreakTime"] = function(minutes: number) {
  this["breakDuration"] = (this["breakDuration"] || 0) + minutes;
  return this["save"]();
};

export const PomodoroSession = mongoose.model<IPomodoroSession, IPomodoroSessionModel>("PomodoroSession", pomodoroSessionSchema); 
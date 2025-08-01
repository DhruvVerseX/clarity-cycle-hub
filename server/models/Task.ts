/**
 * Task Model Schema
 * Defines the structure for task documents in MongoDB
 */

import mongoose, { Document, Schema } from "mongoose";

/**
 * Task document interface
 */
export interface ITask extends Document {
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  estimatedPomodoros?: number;
  completedPomodoros?: number;
  tags?: string[];
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  markComplete(): Promise<ITask>;
  addPomodoro(): Promise<ITask>;
}

/**
 * Task model interface with static methods
 */
export interface ITaskModel extends mongoose.Model<ITask> {
  findByStatus(status: string): Promise<ITask[]>;
  findOverdue(): Promise<ITask[]>;
}

/**
 * Task schema definition
 */
const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      minlength: [1, "Title must be at least 1 character"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    status: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "completed"],
        message: "Status must be one of: todo, in-progress, completed"
      },
      default: "todo",
      required: true
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be one of: low, medium, high"
      },
      default: "medium",
      required: true
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function(this: ITask, value: Date) {
          if (value && value < new Date()) {
            return false;
          }
          return true;
        },
        message: "Due date cannot be in the past"
      }
    },
    estimatedPomodoros: {
      type: Number,
      min: [1, "Estimated pomodoros must be at least 1"],
      max: [50, "Estimated pomodoros cannot exceed 50"],
      default: 1
    },
    completedPomodoros: {
      type: Number,
      min: [0, "Completed pomodoros cannot be negative"],
      default: 0
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [20, "Tag cannot exceed 20 characters"]
    }],
    userId: {
      type: String,
      required: false // Will be required when authentication is fully implemented
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual for progress percentage
 */
taskSchema.virtual("progressPercentage").get(function(this: ITask) {
  if (!this.estimatedPomodoros || this.estimatedPomodoros === 0) {
    return 0;
  }
  return Math.min((this.completedPomodoros || 0) / this.estimatedPomodoros * 100, 100);
});

/**
 * Virtual for overdue status
 */
taskSchema.virtual("isOverdue").get(function(this: ITask) {
  if (!this.dueDate || this.status === "completed") {
    return false;
  }
  return new Date() > this.dueDate;
});

/**
 * Virtual for completion status
 */
taskSchema.virtual("isCompleted").get(function(this: ITask) {
  return this.status === "completed";
});

/**
 * Indexes for better query performance
 */
taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ priority: 1, dueDate: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ "completedPomodoros": 1, "estimatedPomodoros": 1 });

/**
 * Pre-save middleware to validate data
 */
taskSchema.pre("save", function(next) {
  // Ensure completed pomodoros don't exceed estimated
  if (this.completedPomodoros && this.estimatedPomodoros) {
    if (this.completedPomodoros > this.estimatedPomodoros) {
      this.completedPomodoros = this.estimatedPomodoros;
    }
  }
  
  // Auto-complete task if all pomodoros are done
  if (this.completedPomodoros && this.estimatedPomodoros) {
    if (this.completedPomodoros >= this.estimatedPomodoros && this.status !== "completed") {
      this.status = "completed";
    }
  }
  
  next();
});

/**
 * Static method to get tasks by status
 */
taskSchema.statics["findByStatus"] = function(status: string) {
  return this.find({ status });
};

/**
 * Static method to get overdue tasks
 */
taskSchema.statics["findOverdue"] = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $ne: "completed" }
  });
};

/**
 * Instance method to mark as complete
 */
taskSchema.methods["markComplete"] = function() {
  this["status"] = "completed";
  this["completedPomodoros"] = this["estimatedPomodoros"];
  return this["save"]();
};

/**
 * Instance method to add pomodoro
 */
taskSchema.methods["addPomodoro"] = function() {
  if (this["completedPomodoros"] < this["estimatedPomodoros"]) {
    this["completedPomodoros"] += 1;
    
    // Auto-complete if all pomodoros are done
    if (this["completedPomodoros"] >= this["estimatedPomodoros"]) {
      this["status"] = "completed";
    }
  }
  return this["save"]();
};

export const Task = mongoose.model<ITask, ITaskModel>("Task", taskSchema); 
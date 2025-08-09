import mongoose from "mongoose";

/**
 * Task Model Schema (ESM)
 * Aligns with controllers and schema documentation.
 *
 * Fields include title, description, status, priority, dueDate,
 * pomodoro counters, tags, and timestamps.
 */

const TaskSchema = new mongoose.Schema(
  {
    // Core fields
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    // Status and priority
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      required: true,
    },

    // Scheduling
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // Allow undefined/null; if set, cannot be invalid Date
          return !(value instanceof Date) || !isNaN(value.getTime());
        },
        message: "Invalid due date",
      },
    },

    // Pomodoro-related
    estimatedPomodoros: {
      type: Number,
      min: [1, "Estimated pomodoros must be at least 1"],
      max: [50, "Estimated pomodoros cannot exceed 50"],
      default: 1,
    },
    completedPomodoros: {
      type: Number,
      min: [0, "Completed pomodoros cannot be negative"],
      default: 0,
    },

    // Tagging and ownership
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          return Array.isArray(tags) && tags.every((t) => typeof t === "string" && t.length <= 20);
        },
        message: "Each tag must be a string up to 20 characters",
      },
    },
    userId: {
      type: String,
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
TaskSchema.virtual("progressPercentage").get(function () {
  if (typeof this.estimatedPomodoros !== "number" || this.estimatedPomodoros <= 0) return 0;
  const clampedCompleted = Math.max(0, Math.min(this.completedPomodoros || 0, this.estimatedPomodoros));
  return Math.round((clampedCompleted / this.estimatedPomodoros) * 100);
});

TaskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate) return false;
  const now = new Date();
  return this.status !== "completed" && this.dueDate.getTime() < now.getTime();
});

TaskSchema.virtual("isCompleted").get(function () {
  return this.status === "completed";
});

// Indexes
TaskSchema.index({ status: 1, createdAt: -1 });
TaskSchema.index({ priority: 1, dueDate: 1 });
TaskSchema.index({ tags: 1 });
TaskSchema.index({ completedPomodoros: 1, estimatedPomodoros: 1 });

// Pre-save validations and auto-updates
TaskSchema.pre("save", function (next) {
  // Clamp completed pomodoros
  if (typeof this.completedPomodoros === "number" && typeof this.estimatedPomodoros === "number") {
    if (this.completedPomodoros > this.estimatedPomodoros) {
      this.completedPomodoros = this.estimatedPomodoros;
    }
  }

  // Auto-complete when finished
  if (
    typeof this.completedPomodoros === "number" &&
    typeof this.estimatedPomodoros === "number" &&
    this.estimatedPomodoros > 0 &&
    this.completedPomodoros >= this.estimatedPomodoros
  ) {
    this.status = "completed";
  }

  next();
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export default Task;



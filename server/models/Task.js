import mongoose from "mongoose";

/**
 * Mongoose Task schema aligned with frontend requirements.
 * - status: "todo" | "in-progress" | "completed"
 * - priority: "low" | "medium" | "high"
 * - uses timestamps to provide createdAt and updatedAt
 */
const taskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false },
    title: { type: String, required: true },
    description: { type: String, required: false },
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
    dueDate: { type: Date, required: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;



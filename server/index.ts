import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Import models
import { Task, PomodoroSession, User } from "./models/index.js";

// Import routes
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";

// Import middleware
import { authenticateToken, AuthRequest } from "./middleware/auth.js";

// Import configuration
import { authConfig } from "./config/auth.js";
import { validateAndExit, getConfigurationSummary } from "./config/validate.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env["PORT"] || 5000;

// Middleware
app.use(cors({
  origin: process.env["CORS_ORIGIN"] || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env["MONGODB_URI"] || "mongodb://localhost:27017/clarity-cycle-hub";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// API Routes

// Authentication routes
app.use("/api/auth", authRoutes);

// Contact routes
app.use("/api/contact", contactRoutes);

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Configuration info endpoint
app.get("/api/config", (req: Request, res: Response) => {
  res.json({
    auth: getConfigurationSummary(),
    server: {
      version: authConfig.api.version,
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Task Routes (Protected)
app.get("/api/tasks", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.user!.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/api/tasks", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Task title is required" });
    }

    const task = new Task({
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId: req.user!.id
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.put("/api/tasks/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user!.id });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Pomodoro Session Routes (Protected)
app.get("/api/pomodoro-sessions", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await PomodoroSession.find({ userId: req.user!.id })
      .populate("taskId", "title")
      .sort({ startTime: -1 });
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching pomodoro sessions:", error);
    res.status(500).json({ error: "Failed to fetch pomodoro sessions" });
  }
});

app.post("/api/pomodoro-sessions", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { duration, taskId, notes } = req.body;
    
    if (!duration) {
      return res.status(400).json({ error: "Session duration is required" });
    }

    const session = new PomodoroSession({
      duration,
      taskId,
      notes,
      userId: req.user!.id
    });

    const savedSession = await session.save();
    const populatedSession = await PomodoroSession.findById(savedSession._id)
      .populate("taskId", "title");

    res.status(201).json(populatedSession);
  } catch (error) {
    console.error("Error creating pomodoro session:", error);
    res.status(500).json({ error: "Failed to create pomodoro session" });
  }
});

app.put("/api/pomodoro-sessions/:id/complete", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const session = await PomodoroSession.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      {
        completed: true,
        endTime: new Date(),
        notes
      },
      { new: true }
    ).populate("taskId", "title");

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    console.error("Error completing pomodoro session:", error);
    res.status(500).json({ error: "Failed to complete session" });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Validate configuration before starting
    await validateAndExit();
    
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`⚙️  Config info: http://localhost:${PORT}/api/config`);
      console.log(`🌐 Frontend: ${process.env["CORS_ORIGIN"] || "http://localhost:5173"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer(); 
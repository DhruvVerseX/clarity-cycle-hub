import Task from "../models/Task.js";

/**
 * Create a new task
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, userId } = req.body ?? {};

    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }

    const validStatuses = ["todo", "in-progress", "completed"];
    const validPriorities = ["low", "medium", "high"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: "Invalid priority" });
    }

    const payload = {
      title: title.trim(),
      description: typeof description === "string" ? description : undefined,
      status: (status && validStatuses.includes(status)) ? status : undefined,
      priority: (priority && validPriorities.includes(priority)) ? priority : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId: typeof userId === "string" ? userId : undefined,
    };

    const task = await Task.create(payload);
    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get all tasks (optionally by userId as query: ?userId=...)
 */
export const getTasks = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a task by id
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body ?? {};

    const updates = {};
    if (typeof title === "string") updates.title = title;
    if (typeof description === "string") updates.description = description;
    if (typeof status === "string") updates.status = status;
    if (typeof priority === "string") updates.priority = priority;
    if (typeof dueDate === "string") updates.dueDate = new Date(dueDate);

    const validStatuses = ["todo", "in-progress", "completed"];
    const validPriorities = ["low", "medium", "high"];
    if (updates.status && !validStatuses.includes(updates.status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    if (updates.priority && !validPriorities.includes(updates.priority)) {
      return res.status(400).json({ error: "Invalid priority" });
    }

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json(task);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete a task by id
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json({ message: "Task deleted" });
  } catch (error) {
    return next(error);
  }
};



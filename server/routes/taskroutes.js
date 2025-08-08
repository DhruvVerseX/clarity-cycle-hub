import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

// Create task
router.post("/", createTask);

// Read tasks (optionally filter by userId via query)
router.get("/", getTasks);

// Update task
router.put("/:id", updateTask);

// Delete task
router.delete("/:id", deleteTask);

export default router;

 
import Task from '../models/Task.js';
import { v4 as uuidv4 } from 'uuid';

// Create a new task
export const createTask = async (req, res, next) => {
  try {
    const taskData = {
      taskId: uuidv4(),
      ...req.body
    };
    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// Get all tasks for a user
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// Weekly summary
export const getWeeklySummary = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const tasks = await Task.find({ userId, date: { $gte: oneWeekAgo } });
    res.json({
      totalPomodoros: tasks.reduce((sum, t) => sum + (t.actualPomodoros || 0), 0),
      totalMinutes: tasks.reduce((sum, t) => sum + (t.durationMinutes || 0), 0),
      tasks
    });
  } catch (error) {
    next(error);
  }
};

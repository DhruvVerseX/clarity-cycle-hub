/**
 * Models Index
 * Exports all database models for easy importing
 */

export { Task, type ITask, type ITaskModel } from "./Task";
export { PomodoroSession, type IPomodoroSession, type IPomodoroSessionModel } from "./PomodoroSession";
export { User, type IUser, type IUserModel } from "./User";

// Re-export commonly used types
export type { Document } from "mongoose"; 
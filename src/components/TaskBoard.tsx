"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Check, Edit3, Trash2, Flag, Loader2 } from "lucide-react";
import { useTasks } from "@/hooks/use-api";
import { type Task as ApiTask } from "@/services/api";

export function TaskBoard() {
  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting
  } = useTasks();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  type NewTaskState = {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "in-progress" | "completed";
  };
  const [newTask, setNewTask] = useState<NewTaskState>({
    title: "",
    description: "",
    priority: "medium",
    status: "todo"
  });

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      return;
    }

    createTask({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: newTask.status
    });

    setNewTask({ title: "", description: "", priority: "medium", status: "todo" });
    setIsDialogOpen(false);
  };

  const handleToggleComplete = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "todo" : "completed";
    updateTask({ id: taskId, updates: { status: newStatus } });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const completedTasks = tasks.filter((task) => task.status === "completed");
  const pendingTasks = tasks.filter((task) => task.status !== "completed");

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-foreground">Task Board</CardTitle>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-focus">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  placeholder="Enter task title..."
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-input/50 border-border/50"
                />
              </div>
              
              <div>
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  placeholder="Enter task description..."
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-input/50 border-border/50 min-h-[80px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-priority">Priority</Label>
                  <select
                    /**
                     * Priority select for new task.
                     * Ensures only valid priority values are set and type-checked.
                     */
                    id="task-priority"
                    value={newTask.priority}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      type TaskPriority = "low" | "medium" | "high";
                      const allowedPriorities: readonly TaskPriority[] = ["low", "medium", "high"] as const;
                      const value: string = e.target.value;
                      const isTaskPriority = (v: string): v is TaskPriority =>
                        (allowedPriorities as readonly string[]).includes(v);
                      setNewTask((prev) => ({
                        ...prev,
                        priority: isTaskPriority(value) ? value : prev.priority,
                      }));
                    }}
                    className="w-full p-2 rounded-md bg-input/50 border border-border/50 text-foreground"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="task-status">Status</Label>
                  <select
                    /**
                     * Status select for new task.
                     * Ensures only valid status values are set and type-checked.
                     */
                    id="task-status"
                    value={newTask.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      type TaskStatus = "todo" | "in-progress" | "completed";
                      const allowedStatuses: readonly TaskStatus[] = ["todo", "in-progress", "completed"] as const;
                      const value: string = e.target.value;
                      const isTaskStatus = (v: string): v is TaskStatus =>
                        (allowedStatuses as readonly string[]).includes(v);
                      setNewTask((prev) => ({
                        ...prev,
                        status: isTaskStatus(value) ? value : prev.status,
                      }));
                    }}
                    className="w-full p-2 rounded-md bg-input/50 border border-border/50 text-foreground"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleCreateTask} 
                  className="btn-focus flex-1"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Task"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="btn-ghost"
                  disabled={isCreating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading tasks...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="text-destructive mb-2">Failed to load tasks</div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        )}

        {/* Task Statistics */}
        {!isLoading && !error && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="text-2xl font-bold text-foreground">{tasks.length}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="text-2xl font-bold text-accent">{completedTasks.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="text-2xl font-bold text-primary">{pendingTasks.length}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        )}

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Active Tasks</h3>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task._id}
                  className="task-pending p-4 rounded-lg border transition-all duration-300 hover:border-primary/30 hover:shadow-lg animate-slide-up"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground">{task.title}</h4>
                        <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs">
                          <Flag className={`w-3 h-3 mr-1 ${getPriorityColor(task.priority)}`} />
                          {task.priority}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          Status: {task.status}
                        </span>
                        {task.dueDate && (
                          <span>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleComplete(task._id, task.status)}
                        className="btn-ghost text-accent hover:text-accent-foreground"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTask(task._id)}
                        className="btn-ghost text-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Completed Tasks</h3>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div
                  key={task._id}
                  className="task-completed p-4 rounded-lg border transition-all duration-300 opacity-75 animate-slide-up"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground line-through">{task.title}</h4>
                        <Badge variant="outline" className="text-xs text-accent">
                          <Check className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-through">{task.description}</p>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Completed on {new Date(task.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleComplete(task._id, task.status)}
                        className="btn-ghost"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTask(task._id)}
                        className="btn-ghost text-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!isLoading && !error && tasks.length === 0) && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-card/50 flex items-center justify-center">
              <Plus className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-4">Create your first task to start tracking your productivity</p>
            <Button onClick={() => setIsDialogOpen(true)} className="btn-focus">
              <Plus className="w-4 h-4 mr-2" />
              Create First Task
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
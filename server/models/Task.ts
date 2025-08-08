import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  category: String,
  estimatedPomodoros: Number,
  actualPomodoros: Number,
  status: { type: String, enum: ['completed', 'in-progress', 'skipped'], default: 'in-progress' },
  
  startTime: Date,
  endTime: Date,
  durationMinutes: Number,
  breakDurationMinutes: Number,
  date: { type: Date, required: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notes: String,
  tags: [String]
});

export default mongoose.model('Task', taskSchema);

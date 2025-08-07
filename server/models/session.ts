// models/Session.ts
import mongoose from "mongoose"

const SessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  taskId: { type: String },
  sessionType: { type: String, enum: ['focus', 'short_break', 'long_break'], required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
  date: { type: Date, required: true }  // for easier day filtering
})

export default mongoose.models['Session'] || mongoose.model("Session", SessionSchema)

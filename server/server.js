import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskroutes.js';

// Load environment from server/.env first, then optionally from project root .env as fallback
dotenv.config();
try {
  // Attempt to also load ../.env (project root) for local dev setups
  const rootEnvUrl = new URL('../.env', import.meta.url);
  dotenv.config({ path: rootEnvUrl.pathname });
} catch {}
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Health endpoint for frontend health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

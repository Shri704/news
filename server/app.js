import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import newsRoutes from './routes/newsRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import searchHistoryRoutes from './routes/searchHistoryRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve AI-generated images saved by imageService
app.use('/images', express.static(path.join(__dirname, 'public/images')));


// Routes
app.use('/api/news', newsRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/search/history', searchHistoryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR',
    },
  });
});

export default app;

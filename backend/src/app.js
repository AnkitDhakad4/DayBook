import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import statsRoutes from './routes/stats.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import ApiResponse from './utils/ApiResponse.js';
import ApiError from './utils/ApiError.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/v1/health', (req, res) => {
  res.status(200).json(new ApiResponse(200, { status: 'ok' }, 'Server is healthy'));
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});
app.use(errorMiddleware);

export default app;

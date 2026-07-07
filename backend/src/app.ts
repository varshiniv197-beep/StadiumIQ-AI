import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/api.routes';
import { requestLogger } from './middlewares/logger';
import { errorHandler, AppError } from './middlewares/error';

// Load Environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all origins for the dashboard
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use(requestLogger);

// Rate Limiting (Protect authentication and AI queries from exhaustion)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiter globally
app.use('/api/', globalLimiter);

// Register v1 routes
app.use('/api/v1', apiRouter);

// Handle 404 Route Not Found
app.use('*', (_req, _res, next) => {
  next(new AppError(404, 'The requested API endpoint does not exist.'));
});

// Centralized Error Handler
app.use(errorHandler);

// Start server (if not testing)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`StadiumIQ AI Operations Server is booting...`);
    console.log(`Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`API Target  : http://localhost:${PORT}/api/v1`);
    console.log(`Health Check: http://localhost:${PORT}/api/v1/health`);
    console.log(`==================================================`);
  });
}

export default app;

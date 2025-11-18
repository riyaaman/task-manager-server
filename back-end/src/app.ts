import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middleware
// Get allowed origins from env
const allowedOrigins = process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(',')
    : [];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));
app.use(express.json());

// Basic health check
app.get('/', (req: Request, res: Response) => {
    res.send('Task Manager API (MongoDB) is running!');
});

// API routes
app.use('/api/tasks', taskRoutes);

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        status: err.status || 500
    });
});

export default app;

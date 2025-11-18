import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';

const app: Application = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow frontend origin
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

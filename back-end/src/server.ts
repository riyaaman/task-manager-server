
import app from './app';
import connectDB from './config/database';

const PORT = process.env.PORT || 5000;

// Connect to database and then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`Access it at http://localhost:${PORT}`);
    });
});
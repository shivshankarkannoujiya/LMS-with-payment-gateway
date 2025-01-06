import express from 'express';
import morgan from 'morgan';
const app = express();

// logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body Parser Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Global Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// API Routes

// it should be always at bottom
// 404 handler
app.use((_, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found !!',
    });
});

export { app };

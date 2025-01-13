import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// Global rate limting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    limit: 100, // limit each IP to 100 request per 'window' (here, per 15 minutes)
    message: 'Too many request from this IP, please try later',
});

// security middleware
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(hpp());
app.use('/api', limiter);

// logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body Parser Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Global Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// CORS Configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5137',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'device-remember-token',
            'Access-Control-Allow-Origin',
            'Origin',
            'Accept',
        ],
    })
);

// API Routes
import healthRoute from './routes/health.routes.js';
app.use('/health', healthRoute);

// it should be always at bottom
// 404 handler
app.use((_, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found !!',
    });
});

export { app };

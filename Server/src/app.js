import express from 'express';
import morgan from 'morgan';
const app = express();


// Body Parser Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({extended: true, limit: "10kb"}))



// it should be always at bottom
// 404 handler
app.use((_, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found !!',
    });
});

export { app };

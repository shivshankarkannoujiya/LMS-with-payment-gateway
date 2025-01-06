import express from 'express';
const app = express();




// it should be always at bottom
// 404 handler
app.use((_, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found !!',
    });
});

export { app };

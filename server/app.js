import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user-route.js';
import authRouter from './routes/auth-route.js';

import dotenv from 'dotenv';
import ErrorHandler from './utils/ErrorHandler.js';

// config .env
dotenv.config();

const app = express();
app.use(express.json()); // postman test purpose

// database
const DB_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
// const DB_CONNECTION_STRING = 'mongodb://127.0.0.1:27017/realty-savvy';
mongoose
    .connect(DB_CONNECTION_STRING)
    .then(() => {
        console.log('Database connected successfully!!');
    })
    .catch((err) => {
        console.log('Database connection error:', err);
    });

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

// =================================================================
// ======================= Middlewares =============================
// =================================================================
// Middleware to handle requests for routes not previously defined
app.all('*', (req, res, next) => {
    const UndefinedPageError = new ErrorHandler('Page not found', 404);
    next(UndefinedPageError); // Pass the error to the next middleware
});

// ------------------ Error Handler Middleware ------------------
app.use((err, req, res, next) => {
    const message = err.message || 'something went wrong';
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
    });
});

// connect to port
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('listening on port: ' + port);
});

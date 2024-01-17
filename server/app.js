import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import userRouter from './routes/user-route.js';
import authRouter from './routes/auth-route.js';
import ErrorHandler from './utils/ErrorHandler.js';
import cookieParser from 'cookie-parser';
// config .env
dotenv.config();

const app = express();
app.use(express.json()); // postman test purpose
app.use(cookieParser()); // get the information from the cookie
// =================================================================
// ==================== Session & Cors =============================
// =================================================================
// session configuration
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECTION_STRING }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // set to true if website uses HTTPS
        sameSite: 'lax', // protection against CSRF
    },
};
app.use(session(sessionConfig));

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

// =================================================================
// ========================= Database ==============================
// =================================================================

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

// =================================================================
// ======================= Routes ==================================
// =================================================================
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

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
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log('listening on port: ' + port);
});

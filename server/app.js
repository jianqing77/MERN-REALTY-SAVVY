import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import userRouter from './routes/user-route.js';
import authRouter from './routes/auth-route.js';
import listingRouter from './routes/listing-route.js';
import apartmentRouter from './routes/apartment-route.js';
import ErrorHandler from './utils/ErrorHandler.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';

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
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECTION_STRING }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // set to true if website uses HTTPS
        sameSite: 'lax', // protection against CSRF
    },
};
app.use(session(sessionConfig));
app.use(helmet());

app.use(
    cors({
        origin: [
            'http://localhost:5175',
            'http://localhost:5173',
            'https://realtysavvy.netlify.app',
        ],
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

// create dynamic directories name
const __dirname = path.resolve();
// =================================================================
// ======================= Routes ==================================
// =================================================================
// app.get('/', (req, res) => {
//     res.json({ message: 'Welcome to Realty Savvy Server!' });
// });

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);
app.use('/api/apartments', apartmentRouter); // New route for listings from the public API

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
app.use(mongoSanitize()); // prevent mongo injection

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

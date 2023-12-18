import express from 'express';
import mongoose from 'mongoose';

require('dotenv').config();
const app = express();

// config .env

// database
mongoose.connect(process.env.MONGO_CONNECTION_STRING);

// connect to port
const port = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log('listening on port 3000');
});

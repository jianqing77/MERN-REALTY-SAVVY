import UserModel from '../models/user-model.js';
import bcryptjs from 'bcryptjs';
import cachAsync from '../utils/cachAsync.js';
import ErrorHandler from '../utils/ErrorHandler.js';

export const signUp = cachAsync(async (req, res) => {
    // console.log(req.body)
    if (!req.body.username || !req.body.password || !req.body.emial) {
        throw new ErrorHandler('Invalid User Data', 400);
    }
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new UserModel({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json('User created successfully');
});

// export const signIn = (req, res) => {};
// export const logOut = (req, res) => {};

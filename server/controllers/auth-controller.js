import bcryptjs from 'bcryptjs';
import catchAsync from '../utils/catchAsync.js';
import UserModel from '../models/user-model.js';
import * as UserDao from '../dao/user-dao.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import { generateRandomPassword, googleUserNameConversion } from '../utils/util.js';

export const signUp = catchAsync(async (req, res) => {
    // console.log(req.body)
    if (!req.body.userName || !req.body.password || !req.body.email) {
        throw new ErrorHandler('Invalid User Data', 400);
    }
    const { userName, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new UserModel({ userName, email, password: hashedPassword });
    try {
        await UserDao.createUser(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        throw new ErrorHandler('Error creating user', 500);
    }
    req.session['currentUser'] = newUser;
    res.status(201).json(newUser);
});

export const signIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const result = await UserDao.findUserByCredentials(email, password);

    if (result && !result.error) {
        // If result is a user object, set the user in the session and respond
        req.session['currentUser'] = result;
        res.status(200).json(result);
    } else if (result.error === 'UserNotFound') {
        // If user is not found, send a specific message
        res.status(404).json({ message: 'User not found. Please register.' });
    } else if (result.error === 'PasswordIncorrect') {
        // If password is incorrect, send a specific message
        res.status(401).json({ message: 'Incorrect password. Please try again.' });
    } else {
        // Handle any other potential issues in a generic way
        res.status(500).json({ message: 'An error occurred while signing in.' });
    }
});

export const google = catchAsync(async (req, res) => {
    const userData = req.body;
    const foundedUser = await UserDao.findUserByEmail(userData.email);

    // if user exits
    if (foundedUser) {
        req.session['currentUser'] = foundedUser;
        res.status(200).json(foundedUser);
    } else {
        const generatedPassword = generateRandomPassword();
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new UserModel({
            userName: googleUserNameConversion(userData.userName),
            email: userData.email,
            password: hashedPassword,
            avatar: userData.avatar,
        });
        await newUser.save();
        req.session['currentUser'] = newUser;
        res.status(200).json(newUser);
    }
});

export const signout = catchAsync(async (req, res) => {
    // Destroy server-side session
    req.session.destroy((err) => {
        if (err) {
            // handle error case...
            res.status(500).send('Error logging out');
        } else {
            // Clear the session ID cookie from the client-side
            res.clearCookie('connect.sid'); // Replace 'connect.sid' with your cookie name if different
            // Send a response indicating logout was successful
            res.status(200).send('Logged out');
        }
    });
});

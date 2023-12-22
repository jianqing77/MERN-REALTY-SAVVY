import bcryptjs from 'bcryptjs';
import catchAsync from '../utils/cachAsync.js';
import UserModel from '../models/user-model.js';
import * as UserDao from '../dao/user-dao.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import { generateRandomPassword, googleUsernameConversion } from '../utils/util.js';

export const signUp = catchAsync(async (req, res) => {
    // console.log(req.body)
    if (!req.body.username || !req.body.password || !req.body.email) {
        throw new ErrorHandler('Invalid User Data', 400);
    }
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new UserModel({ username, email, password: hashedPassword });
    await UserDao.createUser(newUser);
    req.session['currentUser'] = newUser;
    res.status(201).json(newUser);
});

export const signIn = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const foundedUser = await UserDao.findUserByCredentials(email, password);
    req.session['currentUser'] = foundedUser;
    // console.log('User found successfully: ' + foundedUser);
    res.status(200).json(foundedUser);
});

export const profile = catchAsync(async (req, res) => {
    const currentUser = req.session['currentUser'];
    if (!currentUser) {
        throw new ErrorHandler('User not found', 400);
    }
    res.json(currentUser);
});

export const signout = catchAsync(async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
});

export const update = catchAsync(async (req, res) => {});

export const google = catchAsync(async (req, res) => {
    const userData = req.body;
    const foundUser = await UserDao.findUserByEmail(userData.email);
    // if user exits
    if (foundUser) {
        const token = await jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = foundUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
    } else {
        const generatedPassword = generateRandomPassword();
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new UserModel({
            username: googleUsernameConversion(userData.username),
            email: userData.email,
            password: hashedPassword,
            avatar: userData.avatar,
        });
        await newUser.save();
        const token = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
    }
});

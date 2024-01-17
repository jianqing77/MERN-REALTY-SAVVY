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
    req.session.destroy();
    res.sendStatus(200);
});

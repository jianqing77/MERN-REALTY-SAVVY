import UserModel from '../models/user-model.js';
import bcryptjs from 'bcryptjs';
import catchAsync from '../utils/catchAsync.js';

export const findAllUsers = () => UserModel.find();

export const findUserById = (uid) => UserModel.findById(uid);

export const findUserByUsername = (userName) => UserModel.findOne({ userName });
export const findUserByEmail = (email) => UserModel.findOne({ email });

export const findUserByCredentials = async (email, password) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        return { error: 'UserNotFound' }; // Indicate that the user was not found
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
        return { error: 'PasswordIncorrect' }; // Indicate that the password is incorrect
    }
    return user; // Return the user object if credentials are correct
};

export const createUser = async (user) => {
    return await UserModel.create(user);
};

export const updateUser = async (uid, updatedUserData) => {
    const updatedUser = await UserModel.findByIdAndUpdate({ _id: uid }, updatedUserData, {
        new: true,
    });
    return updatedUser;
};

export const deleteUser = (uid) => UserModel.findByIdAndDelete({ _id: uid });

import UserModel from '../models/user-model.js';
import bcryptjs from 'bcryptjs';
import catchAsync from '../utils/catchAsync.js';

export const findAllUsers = () => UserModel.find();

export const findUserById = (uid) => UserModel.findById(uid);

export const findUserByUsername = (userName) => UserModel.findOne({ userName });
export const findUserByEmail = (email) => UserModel.findOne({ email });

export const findUserByCredentials = async (email, password) => {
    const user = await UserModel.findOne({ email });
    // console.log('user founded with email' + user);
    // compare the hashed password!!
    // const compareResult = await bcryptjs.compare(password, user.password);
    // console.log(compareResult);
    if (user && (await bcryptjs.compare(password, user.password))) {
        return user;
    }
    return null; // If user is not found or password does not match, return null
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

export const deleteUser = (uid) => UserModel.deleteOne({ _id: uid });

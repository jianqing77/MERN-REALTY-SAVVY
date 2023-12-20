import UserModel from '../models/user-model.js';
import bcryptjs from 'bcryptjs';
import catchAsync from '../utils/cachAsync.js';

export const findAllUsers = () => UserModel.find();

export const findUserById = (uid) => UserModel.findById(uid);

export const findUserByUsername = (username) => UserModel.findOne({ username });

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

export const updateUser = async (uid, user) => {
    return await UserModel.updateOne({ _id: uid }, user);
};

export const deleteUser = (uid) => UserModel.deleteOne({ _id: uid });

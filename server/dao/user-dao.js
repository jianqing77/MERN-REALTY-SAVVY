import UserModel from '../models/user-model.js';
import bcrypt from 'bcryptjs';
import ErrorHandler from '../utils/ErrorHandler.js'; // Make sure to use the correct path

const UserDAO = {
    findAllUsers: async () => {
        return UserModel.find();
    },

    findUserById: async (uid) => {
        const user = await UserModel.findById(uid);
        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }
        return user;
    },

    findUserByUsername: async (userName) => {
        return UserModel.findOne({ userName });
    },

    findUserByEmail: async (email) => {
        return UserModel.findOne({ email });
    },

    findUserByCredentials: async (email, password) => {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new ErrorHandler('Password is incorrect', 401);
        }
        return user;
    },

    createUser: async (userData) => {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 8);
            const user = new UserModel({
                ...userData,
                password: hashedPassword,
            });
            return await user.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ErrorHandler('User already exists', 409);
            } else {
                throw new ErrorHandler('Error creating user', 500);
            }
        }
    },

    updateUser: async (uid, updatedUserData) => {
        const updatedUser = await UserModel.findByIdAndUpdate(uid, updatedUserData, {
            new: true,
        });
        if (!updatedUser) {
            throw new ErrorHandler('User not found', 404);
        }
        return updatedUser;
    },

    deleteUser: async (uid) => {
        const deletedUser = await UserModel.findByIdAndDelete(uid);
        if (!deletedUser) {
            throw new ErrorHandler('User not found', 404);
        }
        return deletedUser;
    },
};

export default UserDAO;

import ErrorHandler from '../utils/ErrorHandler.js';
import catchAsync from '../utils/catchAsync.js';
import bcryptjs from 'bcryptjs';

import * as UserDao from '../dao/user-dao.js';

export const profile = catchAsync(async (req, res) => {
    const currentUser = req.session['currentUser'];
    if (!currentUser) {
        throw new ErrorHandler('User not found', 400);
    }
    res.json(currentUser);
});

export const updateUserGeneral = catchAsync(async (req, res) => {
    const currentUser = req.session['currentUser'];
    if (!currentUser) {
        throw new ErrorHandler('User not found', 400);
    }
    if (currentUser._id !== req.params.id) {
        throw new ErrorHandler(
            'Access denied. You can only update your own account!',
            400
        );
    }
    const updatedUser = await UserDao.updateUser(req.params.id, {
        userName: req.body.userName,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        avatar: req.body.avatar,
        city: req.body.avatar,
        region: req.body.region,
        streetAddress: req.body.streetAddress,
        postalCode: req.body.postalCode,
    });
    if (!updatedUser) {
        throw new ErrorHandler('User not found or not updated', 404);
    }
    const { password, ...rest } = updatedUser.toObject(); // Exclude sensitive data
    res.status(200).json(rest);
});

export const updateUserPassword = catchAsync(async (req, res) => {
    const { newPassword } = req.body;
    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);

    const updateResult = await UserDao.updateUser(req.params.id, {
        password: hashedNewPassword,
    });

    if (!updateResult) {
        return next(new ErrorHandler('User not found or not updated', 404));
    }

    // Invalidate the current session and require a re-login
    req.session.destroy((err) => {
        if (err) {
            return next(new ErrorHandler('Failed to destroy the session', 500));
        }

        res.status(200).json({
            message:
                'Password updated successfully. Please log in with your new password.',
        });
    });
});

export const deleteUser = catchAsync(async (req, res, next) => {
    const currentUser = req.session['currentUser'];
    if (!currentUser) {
        throw new ErrorHandler('User not found', 400);
    }
    if (currentUser._id !== req.params.id) {
        throw new ErrorHandler(
            'Access denied. You can only update your own account!',
            400
        );
    }
    await UserDao.deleteUser(currentUser._id);
    res.status(200).json('User has been deleted!');
});

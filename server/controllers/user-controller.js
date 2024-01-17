import ErrorHandler from '../utils/ErrorHandler.js';
import catchAsync from '../utils/catchAsync.js';

import * as UserDao from '../dao/user-dao.js';

export const profile = catchAsync(async (req, res) => {
    const currentUser = req.session['currentUser'];
    if (!currentUser) {
        throw new ErrorHandler('User not found', 400);
    }
    res.json(currentUser);
});

export const updateUser = catchAsync(async (req, res) => {
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
    });
    if (!updatedUser) {
        throw new ErrorHandler('User not found or not updated', 404);
    }
    //
    const { password, ...rest } = updatedUser.toObject(); // Exclude sensitive data

    res.status(200).json(rest);
});

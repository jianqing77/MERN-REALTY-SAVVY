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

const comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

export const updateUserPassword = catchAsync(async (req, res) => {
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
    const { oldPassword, newPassword, confirmedPassword } = req.body;
    // Server-side validations
    if (newPassword !== confirmedPassword) {
        throw new ErrorHandler('New passwords do not match', 400);
    }

    // Verify the old password
    const isMatch = await comparePassword(oldPassword, currentUser.password);
    if (!isMatch) {
        throw new ErrorHandler('Your old password is incorrect', 401);
    }

    // Hash the new password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Save the new hashed password to the database
    const updatedUserPassword = await UserDao.updateUser(req.params.id, {
        password: hashedNewPassword,
    });

    if (!updateResult) {
        throw new ErrorHandler('User not found or not updated', 404);
    }

    // Assuming updateUser returns a user object with a toObject method (like Mongoose)
    // Exclude sensitive data before sending the response
    const userResponse = updateResult.toObject ? updateResult.toObject() : updateResult;
    delete userResponse.password;

    // Send back a success response
    res.status(200).json({
        message: 'Password updated successfully',
        user: userResponse,
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

import ErrorHandler from './ErrorHandler.js';
import catchAsync from './catchAsync.js';
import bcryptjs from 'bcryptjs';

export const generateRandomPassword = () => {
    const generatedPassword = Math.random().toString(36).slice(-8);
    return generatedPassword;
};

export const googleUserNameConversion = (googleUsername) => {
    const convertedUsername =
        googleUsername.split(' ').join('').toLowerCase() +
        Math.random().toString(36).slice(-4);
    return convertedUsername;
};

const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        return await bcryptjs.compare(plainPassword, hashedPassword);
    } catch (err) {
        console.error('Error comparing password', err);
        throw err;
    }
};

export const authenticateAndUpdateRequest = catchAsync(async (req, res) => {
    const currentUser = req.session['currentUser'];

    if (!currentUser) {
        return next(new ErrorHandler('User not found', 400));
    }

    if (currentUser._id !== req.params.id) {
        return next(
            new ErrorHandler('Access denied. You can only update your own account!', 400)
        );
    }

    const { oldPassword, newPassword, confirmedPassword } = req.body;

    if (newPassword !== confirmedPassword) {
        return next(new ErrorHandler('New passwords do not match', 400));
    }

    const isOldPasswordMatch = await comparePassword(oldPassword, currentUser.password);
    if (!isOldPasswordMatch) {
        return next(new ErrorHandler('Your old password is incorrect', 401));
    }
});

// middleware to check user's access
export const checkUserAccess = (req, res, next) => {
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
    next();
};

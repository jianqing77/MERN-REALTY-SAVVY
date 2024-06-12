import ErrorHandler from '../utils/ErrorHandler.js';
import catchAsync from '../utils/catchAsync.js';
import bcryptjs from 'bcryptjs';
import { checkUserAccess } from '../utils/util.js';
import UserDao from '../dao/user-dao.js';

export const profile = catchAsync(async (req, res) => {
    const currentUser = req.session['currentUser'];
    if (!currentUser) {
        throw new ErrorHandler('User not found', 400);
    }
    res.json(currentUser);
});

export const updateUserGeneral = [
    checkUserAccess,
    catchAsync(async (req, res) => {
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
    }),
];

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

export const deleteUser = [
    checkUserAccess,
    catchAsync(async (req, res, next) => {
        await UserDao.deleteUser(req.params.id);
        res.status(200).json('User has been deleted!');
    }),
];

export const addLikedInternalListing = [
    checkUserAccess,
    catchAsync(async (req, res, next) => {
        const user = await UserDao.addLikedInternalListing(
            req.params.id,
            req.body.listingId
        );
        res.status(200).json(user); // updated user
    }),
];

export const removeLikedInternalListing = [
    checkUserAccess,
    catchAsync(async (req, res, next) => {
        const user = await UserDao.removeLikedInternalListing(
            req.params.id,
            req.params.listingId
        );
        res.status(200).json(user); // return the updated user
    }),
];

export const addLikedExternalListing = [
    checkUserAccess,
    catchAsync(async (req, res, next) => {
        const user = await UserDao.addLikedExternalListing(
            req.params.id,
            req.body.propertyID
        );
        res.status(200).json(user); // return the updated user
    }),
];

export const removeLikedExternalListing = [
    checkUserAccess,
    catchAsync(async (req, res, next) => {
        const user = await UserDao.removeLikedExternalListing(
            req.params.id,
            req.params.propertyID
        );
        res.status(200).json(user); // return the updated user
    }),
];

export const fetchLikedExternalListings = catchAsync(async (req, res) => {
    const currentUser = req.session['currentUser'];
    if (!currentUser) {
        throw new ErrorHandler('User not found', 400);
    }

    const likedExternalListings = currentUser.likedExternalListings || [];

    res.json({
        likedExternalListings,
    });
});

export const fetchLikedInternalListings = catchAsync(async (req, res) => {
    const currentUser = req.session['currentUser'];
    if (!currentUser) {
        throw new ErrorHandler('User not found', 400);
    }

    const likedInternalListings = currentUser.likedInternalListings || [];

    res.json({
        likedInternalListings,
    });
});

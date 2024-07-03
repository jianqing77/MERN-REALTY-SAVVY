import { createAsyncThunk } from '@reduxjs/toolkit';
import * as UserService from './user-service.js';

export const fetchUserProfileThunk = createAsyncThunk(
    'user/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const result = await UserService.fetchUserProfile();
            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserGeneralThunk = createAsyncThunk(
    '/user/update-general',
    async ({ userId, userUpdateData }) => {
        // console.log(userId);
        // console.log('From the thunk:' + JSON.stringify(userUpdateData));
        const updateUserGeneralPayload = await UserService.updateUserGeneral(
            userId,
            userUpdateData
        );
        // console.log('User from update user thunk API:', updateUserGeneralPayload); // Log to check the API response
        return updateUserGeneralPayload; // pass in to the reducer as action.payload
    }
);

export const updateUserPasswordThunk = createAsyncThunk(
    '/user/update-password',
    async ({ userId, credentials }) => {
        // console.log(userId);
        // console.log('From the thunk:' + JSON.stringify(credentials));
        const updateUserPasswordPayload = await UserService.updateUserPassword(
            userId,
            credentials
        );
        console.log('User from update user thunk API:', updateUserPasswordPayload); // Log to check the API response
        return updateUserPasswordPayload; // pass in to the reducer as action.payload
    }
);

export const deleteUserThunk = createAsyncThunk('/user/delete', async ({ userId }) => {
    const deleteUserPayload = await UserService.deleteUser(userId);
    return deleteUserPayload; // pass in to the reducer as action.payload
});

// Add a liked internal listing for a specific user by ID
export const addLikedInternalListingThunk = createAsyncThunk(
    '/user/likedInternalListing/add',
    async ({ userId, propertyID }) => {
        console.log('IN THE USER THUNK -- addLikedInternalListingThunk was called');
        const updatedUser = await UserService.addLikedInternalListing(userId, propertyID);
        return updatedUser; // Pass to the reducer as action.payload
    }
);

// Remove a liked internal listing for a specific user by ID
export const removeLikedInternalListingThunk = createAsyncThunk(
    '/user/likedInternalListing/remove',
    async ({ userId, propertyID }) => {
        const updatedUser = await UserService.removeLikedInternalListing(
            userId,
            propertyID
        );
        return updatedUser; // Pass to the reducer as action.payload
    }
);

// Add a liked external listing for a specific user by ID
export const addLikedExternalListingThunk = createAsyncThunk(
    '/user/likedExternalListing/add',
    async ({ userId, propertyID }) => {
        const updatedUser = await UserService.addLikedExternalListing(userId, propertyID);
        return updatedUser; // Pass to the reducer as action.payload
    }
);

// Remove a liked external listing for a specific user by ID
export const removeLikedExternalListingThunk = createAsyncThunk(
    '/user/likedExternalListing/remove',
    async ({ userId, propertyID }) => {
        const updatedUser = await UserService.removeLikedExternalListing(
            userId,
            propertyID
        );
        return updatedUser; // Pass to the reducer as action.payload
    }
);

export const fetchLikedExternalListingsThunk = createAsyncThunk(
    '/user/likedExternalListing',
    async ({ userId }) => {
        const likedExternalListings = await UserService.fetchLikedExternalListings(
            userId
        );
        return likedExternalListings;
    }
);

export const fetchLikedInternalListingsThunk = createAsyncThunk(
    '/user/likedInternalListing',
    async ({ userId }) => {
        const likedExternalListingsPayload = await UserService.fetchLikedInternalListings(
            userId
        );
        console.log(
            'THUNK -- fetchLikedInternalListingsThunk was called',
            likedExternalListingsPayload
        );
        return likedExternalListingsPayload;
    }
);

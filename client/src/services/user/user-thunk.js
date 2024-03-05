import { createAsyncThunk } from '@reduxjs/toolkit';
import * as UserService from './user-service.js';

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
        console.log(userId);
        console.log('From the thunk:' + JSON.stringify(credentials));
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

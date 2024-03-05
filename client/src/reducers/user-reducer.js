import { createSlice } from '@reduxjs/toolkit';
import {
    deleteUserThunk,
    updateUserGeneralThunk,
    updateUserPasswordThunk,
} from '../services/user/user-thunk.js';
import { updateUserInAuth } from './auth-reducer.js';
import { useDispatch } from 'react-redux';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        error: null,
        message: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Update User General
        builder.addCase(updateUserGeneralThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUserGeneralThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            console.log(action.payload);
        });
        builder.addCase(updateUserGeneralThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // Update User Password
        builder.addCase(updateUserPasswordThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUserPasswordThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            console.log(action.payload);
        });
        builder.addCase(updateUserPasswordThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // Delete User
        builder.addCase(deleteUserThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            console.log(action.payload);
        });
        builder.addCase(deleteUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default userSlice.reducer;

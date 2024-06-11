import { createSlice } from '@reduxjs/toolkit';
import {
    signUpThunk,
    signInThunk,
    authGoogleThunk,
    signOutThunk,
} from '../services/auth/auth-thunk.js';
import { updateUserGeneralThunk, deleteUserThunk } from '../services/user/user-thunk.js';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: null,
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        updateUserInAuth: (state, action) => {
            state.currentUser = action.payload;
        },
        deleteUserInAuth: (state) => {
            state.currentUser = null;
        },
    },
    extraReducers: (builder) => {
        // signUpThunk
        builder.addCase(signUpThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(signUpThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
        });
        builder.addCase(signUpThunk.rejected, (state, action) => {
            console.log(state);
            state.loading = false;
            state.error = action.error.message;
        });
        // signInThunk
        builder.addCase(signInThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(signInThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.currentUser = action.payload.user;
            state.message = action.payload.message;
            console.log(action.payload);
        });
        builder.addCase(signInThunk.rejected, (state, action) => {
            console.log(state);
            state.loading = false;
            state.error = action.error.message;
        });
        // AuthGoogleThunk
        builder.addCase(authGoogleThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(authGoogleThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.currentUser = action.payload.user;
            state.message = action.payload.message;
            console.log(action.payload);
        });
        builder.addCase(authGoogleThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // Update User
        builder.addCase(updateUserGeneralThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUserGeneralThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.currentUser = action.payload.user;
            state.message = action.payload.message;
            // console.log(action.payload);
        });
        builder.addCase(updateUserGeneralThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        builder.addCase(deleteUserThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.currentUser = null;
            state.message = action.payload.message;
            // console.log(action.payload);
        });
        builder.addCase(deleteUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // Sign out user
        builder.addCase(signOutThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(signOutThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.currentUser = null;
            state.message = action.payload;
        });
        builder.addCase(signOutThunk.rejected, (state, action) => {
            // console.log(state);
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export const { updateUserInAuth, deleteUserInAuth } = authSlice.actions;

export default authSlice.reducer;

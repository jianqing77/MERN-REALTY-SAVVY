import { createSlice } from '@reduxjs/toolkit';
import { signUpThunk, signInThunk } from '../services/auth-thunk.js';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: null,
        loading: false,
        error: null,
        message: null,
    },
    reducers: {},
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
    },
});
export default authSlice.reducer;

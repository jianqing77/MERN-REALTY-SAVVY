import { createAsyncThunk } from '@reduxjs/toolkit';
import * as AuthService from './auth-service.js';

export const signUpThunk = createAsyncThunk('/auth/signup', async (credentials) => {
    const signUpPayload = await AuthService.signup(credentials);
    console.log('User from sign up thunk API:', signUpPayload); // Log to check the API response
    return signUpPayload; // pass in to the reducer as action.payload
});

export const signInThunk = createAsyncThunk('/auth/signin', async (credentials) => {
    const signInPayload = await AuthService.signIn(credentials);
    // console.log('User from API:', user); // Log to check the API response
    return signInPayload; // pass in to the reducer as action.payload
});

export const authGoogleThunk = createAsyncThunk('/auth/google', async (userData) => {
    const googlAuthPayload = await AuthService.authGoogle(userData);
    return googlAuthPayload; // pass in to the reducer as action.payload
});

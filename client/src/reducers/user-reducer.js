import { createSlice } from '@reduxjs/toolkit';
import {
    deleteUserThunk,
    updateUserGeneralThunk,
    updateUserPasswordThunk,
    addLikedInternalListingThunk,
    removeLikedInternalListingThunk,
    addLikedExternalListingThunk,
    removeLikedExternalListingThunk,
    fetchUserProfileThunk,
    fetchLikedExternalListingsThunk,
} from '../services/user/user-thunk.js';
import { useDispatch } from 'react-redux';
import {
    signInThunk,
    signOutThunk,
    authGoogleThunk,
} from '../services/auth/auth-thunk.js';
import { fetchAPIListingByIdThunk } from '../services/apartmentAPI/apartment-api-thunk.js';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        error: null,
        message: null,
        profile: {},
        likedExternalListings: [],
        likedInternalListings: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(signInThunk.fulfilled, (state, action) => {
            state.profile = action.payload.user; // Set profile when user signs in
        });
        builder.addCase(authGoogleThunk.fulfilled, (state, action) => {
            state.profile = action.payload.user;
        });
        builder.addCase(signOutThunk.fulfilled, (state) => {
            state.profile = {}; // Clear profile when user signs out
        });
        builder
            .addCase(fetchUserProfileThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfileThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.user;
                state.message = action.payload.message;
            })
            .addCase(fetchUserProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // Update User General
        builder.addCase(updateUserGeneralThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUserGeneralThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload.user;
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
            state.profile = action.payload.user;
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
        // Add Liked Internal Listing
        builder.addCase(addLikedInternalListingThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addLikedInternalListingThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.profile = action.payload.user;
        });
        builder.addCase(addLikedInternalListingThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Remove Liked Internal Listing
        builder.addCase(removeLikedInternalListingThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(removeLikedInternalListingThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.profile = action.payload.user;
        });
        builder.addCase(removeLikedInternalListingThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Add Liked External Listing
        builder.addCase(addLikedExternalListingThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addLikedExternalListingThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.profile = action.payload.user;
        });
        builder.addCase(addLikedExternalListingThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // Remove Liked External Listing
        builder.addCase(removeLikedExternalListingThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(removeLikedExternalListingThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.profile = action.payload.user;
        });
        builder.addCase(removeLikedExternalListingThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        builder.addCase(fetchLikedExternalListingsThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchLikedExternalListingsThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.likedExternalListings = action.payload.likedExternalListingsDetails;
        });
        builder.addCase(fetchLikedExternalListingsThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
    //
});
export default userSlice.reducer;

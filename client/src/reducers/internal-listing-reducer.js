import { createSlice } from '@reduxjs/toolkit';
import {
    findListingByIdThunk,
    createListingThunk,
    updateListingThunk,
    deleteListingThunk,
    findListingByCurrentUserThunk,
    findRentalListingsThunk,
    findSaleListingsThunk,
} from '../services/internal-listing/internal-listing-thunk.js';
import { updateUserInAuth } from './auth-reducer.js';
import { useDispatch } from 'react-redux';

const internalListingSlice = createSlice({
    name: 'internal-listing',
    initialState: {
        listings: [], // array to store multiple listings. It starts as an empty array and gets populated through findAllListingsThunk
        currentListing: null, // hold the data of a single listing when fetched with findListingByIdThunk or when editing a listing.
        userListings: null, // hold the data of the corresponding user's created listings
        foundListings: [], // hold the data of the corresponding filtered listings
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // findListingByIdThunk
        builder.addCase(findListingByIdThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(findListingByIdThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.currentListing = action.payload;
            // console.log(action.payload);
        });
        builder.addCase(findListingByIdThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // findRentalListingsThunk
        builder.addCase(findRentalListingsThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(findRentalListingsThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.foundListings = action.payload;
        });
        builder.addCase(findRentalListingsThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // findSaleListingsThunk
        builder.addCase(findSaleListingsThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(findSaleListingsThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.foundListings = action.payload;
        });
        builder.addCase(findSaleListingsThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // findListingByCurrentUserThunk
        builder.addCase(findListingByCurrentUserThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(findListingByCurrentUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.userListings = action.payload;
            // console.log(action.payload);
        });
        builder.addCase(findListingByCurrentUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // createListingThunk
        builder.addCase(createListingThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createListingThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.listings.push(action.payload);
        });
        builder.addCase(createListingThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // updateListingThunk
        builder.addCase(updateListingThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateListingThunk.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.listings.findIndex(
                (listing) => listing.id === action.payload.id
            );
            if (index !== -1) {
                state.listings[index] = action.payload;
            }
        });
        builder.addCase(updateListingThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // deleteListingThunk
        builder.addCase(deleteListingThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteListingThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.listings = state.listings.filter(
                (listing) => listing.id !== action.payload
            );
        });
        builder.addCase(deleteListingThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default internalListingSlice.reducer;

import { createAsyncThunk } from '@reduxjs/toolkit';
import * as ListingService from './internal-listing-service.js';

export const findListingByIdThunk = createAsyncThunk(
    'internal-listing/findById',
    async (listingId, { rejectWithValue }) => {
        console.log('findListingByIdThunk was called');
        try {
            const listingPayload = await ListingService.findListingById(listingId);
            return listingPayload;
        } catch (error) {
            console.error('Error in thunk find listing by ID:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const findInternalRentalListingsThunk = createAsyncThunk(
    'internal-listing/findRentalListings',
    async (filters, { rejectWithValue }) => {
        try {
            const foundRentalListingPayload = await ListingService.findRentalListings(
                filters
            );
            console.log(
                'findInternalSaleListingsThunk returned:  ' + foundRentalListingPayload
            );
            return foundRentalListingPayload;
        } catch (error) {
            console.error('Error in thunk find rental listings:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const findInternalSaleListingsThunk = createAsyncThunk(
    'internal-listing/findSaleListings',
    async (filters, { rejectWithValue }) => {
        try {
            const foundSaleListingPayload = await ListingService.findSaleListings(
                filters
            );
            console.log(
                'findInternalSaleListingsThunk returned:  ' + foundSaleListingPayload
            );
            return foundSaleListingPayload;
        } catch (error) {
            console.error('Error in thunk find sale listings:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const findListingByCurrentUserThunk = createAsyncThunk(
    'internal-listing/findByCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            // console.log('findListingByCurrentUserThunk is called');
            const listingsPayload = await ListingService.findListingByCurrentUser();
            console.log('listingsPayload in the thunk' + JSON.stringify(listingsPayload));
            return listingsPayload;
        } catch (error) {
            console.error('Error in thunk find listing by current user:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const createListingThunk = createAsyncThunk(
    'internal-listing/createListing',
    async ({ listingData }, { rejectWithValue }) => {
        try {
            const createListingsPayload = await ListingService.createListing(listingData);
            console.log(
                'create listing payload in thunk create listings:',
                createListingsPayload
            );
            return createListingsPayload;
        } catch (error) {
            console.error('Error in thunk create listings:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const updateListingThunk = createAsyncThunk(
    'internal-listing/updateListing',
    async ({ tarId, updatedData }, { rejectWithValue }) => {
        try {
            const updateListingsPayload = await ListingService.updateListing({
                tarId,
                updatedData,
            });
            console.log(
                'update listing payload in thunk update listings:',
                updateListingsPayload
            );
            return updateListingsPayload;
        } catch (error) {
            console.error('Error in thunk update listings:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const deleteListingThunk = createAsyncThunk(
    'internal-listing/deleteListing',
    async (tarId, { rejectWithValue }) => {
        try {
            const deleteListingsPayload = await ListingService.deleteListing(tarId);
            console.log(
                'delete listing payload in thunk delete listings:',
                deleteListingsPayload
            );
            return deleteListingsPayload;
        } catch (error) {
            console.error('Error in thunk delete listings:', error);
            return rejectWithValue(error.message);
        }
    }
);

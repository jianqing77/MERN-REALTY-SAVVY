// apartmentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
    fetchRentalsThunk,
    fetchSalesThunk,
    fetchCoordinatesThunk,
} from '../services/apartmentAPI/apartment-api-thunk.js'; // Adjust the import path as needed

const apartmentsSlice = createSlice({
    name: 'apartments',
    initialState: {
        searchLocation: null,
        listings: [],
        loading: false,
        error: null,
        dataFetched: false, // Flag to indicate successful data fetching
        currentPage: 1,
        totalRecords: 0,
        resultsPerPage: 20,
        coordinates: null,
    },
    reducers: {
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
        resetFetchState(state) {
            state.loading = false;
            state.error = null;
            state.dataFetched = false;
            state.listings = [];
            state.currentPage = 1; // Reset to the first page
            state.totalRecords = 0; // Reset the count of total records
            state.searchLocation = null; // Reset any specific search locations
            state.coordinates = null; // Clear coordinates if they are temporarily stored
        },
    },
    extraReducers: (builder) => {
        builder
            // Handling of fetchRentalsThunk
            .addCase(fetchRentalsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRentalsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.dataFetched = true;
                state.searchLocation = action.payload.searchLocation;
                state.currentPage = action.payload.currentPage;
                state.totalRecords = action.payload.totalRecords;
                state.listings = action.payload.listings;
                state.resultsPerPage = action.payload.resultsPerPage;
            })
            .addCase(fetchRentalsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.listings = [];
            })
            // Handling of fetchSalesThunk
            .addCase(fetchSalesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSalesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.dataFetched = true;
                state.searchLocation = action.payload.searchLocation;
                state.currentPage = action.payload.currentPage;
                state.totalRecords = action.payload.totalRecords;
                state.listings = action.payload.listings;
                state.resultsPerPage = action.payload.resultsPerPage;
            })
            .addCase(fetchSalesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.listings = [];
            })
            // Handling of fetchCoordinatesThunk
            .addCase(fetchCoordinatesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoordinatesThunk.fulfilled, (state, action) => {
                state.loading = false;
                const fullAddress = action.meta.arg.address;
                // console.log('Full address from action:', fullAddress);
                // console.log('state.listings:', JSON.stringify(state.listings));

                const index = state.listings.findIndex((listing) => {
                    // Create a full address from the listing's location parts
                    const listingFullAddress = `${listing.location.address}, ${listing.location.city}, ${listing.location.state}, ${listing.location.zipCode}`;
                    return listingFullAddress === fullAddress;
                });

                // console.log('Index of the listing to update:', index);
                if (index !== -1) {
                    state.listings[index].coordinates = action.payload; // Add coordinates to the listing
                }

                // console.log(
                //     'Coordinates fetched and about to update listing:',
                //     action.payload
                // );
            })
            .addCase(fetchCoordinatesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || action.payload;
            });
    },
});

export const { setCurrentPage, resetFetchState } = apartmentsSlice.actions;
export default apartmentsSlice.reducer;

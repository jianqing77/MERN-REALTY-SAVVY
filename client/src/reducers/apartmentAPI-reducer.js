// apartmentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
    fetchRentalsThunk,
    fetchSalesThunk,
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
                state.listings = action.payload;
                state.dataFetched = true;
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
            });
    },
});

export const { setCurrentPage, setLimit, resetFetchState } = apartmentsSlice.actions;
export default apartmentsSlice.reducer;

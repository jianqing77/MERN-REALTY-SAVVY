// apartmentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
    fetchApartmentsThunk,
    fetchRentalsThunk,
    fetchSalesThunk,
} from '../services/apartmentAPI/apartment-api-thunk.js'; // Adjust the import path as needed

const apartmentsSlice = createSlice({
    name: 'apartments',
    initialState: {
        listings: [],
        loading: false,
        error: null,
        dataFetched: false, // Flag to indicate successful data fetching
    },
    reducers: {
        setPage(state, action) {
            state.currentPage = action.payload;
        },
        setLimit(state, action) {
            state.limit = action.payload;
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
                state.listings = action.payload;
                state.dataFetched = true;
            })
            .addCase(fetchSalesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.listings = [];
            });
    },
});

export const { setPage, setLimit, resetFetchState } = apartmentsSlice.actions;
export default apartmentsSlice.reducer;

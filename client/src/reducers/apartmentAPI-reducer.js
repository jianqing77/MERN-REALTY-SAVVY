// apartmentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
    fetchApartmentsThunk,
    fetchRentalsThunk,
} from '../services/apartmentAPI/apartment-api-thunk.js'; // Adjust the import path as needed

const apartmentsSlice = createSlice({
    name: 'apartments',
    initialState: {
        listings: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalCount: 0,
        limit: 20,
    },
    reducers: {
        setPage(state, action) {
            state.currentPage = action.payload;
        },
        setLimit(state, action) {
            state.limit = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchApartmentsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApartmentsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.listings = action.payload.listings;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchApartmentsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.listings = [];
            })
            // Handling of fetchRentalsThunk
            .addCase(fetchRentalsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRentalsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.listings = action.payload;
            })
            .addCase(fetchRentalsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.listings = [];
            });
    },
});

export const { setPage, setLimit } = apartmentsSlice.actions;
export default apartmentsSlice.reducer;

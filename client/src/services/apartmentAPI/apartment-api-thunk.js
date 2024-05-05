// apartmentsThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { findRentals, findSales } from './apartment-api-service.js'; // Adjust the import path as needed

export const fetchRentalsThunk = createAsyncThunk(
    'apartments/fetchRentals',
    async ({ location, resultsPerPage, page }, { rejectWithValue }) => {
        try {
            const rentalsPayload = await findRentals({
                location,
                resultsPerPage,
                page,
            });
            return rentalsPayload;
        } catch (error) {
            console.error('Error in thunk fetchRentals:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSalesThunk = createAsyncThunk(
    'apartments/fetchSales',
    async ({ location, resultsPerPage, page }, { rejectWithValue }) => {
        try {
            const salesPayload = await findSales({
                location,
                resultsPerPage,
                page,
            });
            return salesPayload;
        } catch (error) {
            console.error('Error in thunk fetchSales:', error);
            return rejectWithValue(error.message);
        }
    }
);

// apartmentsThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { findAllApartments, findRentals } from './apartment-api-service.js'; // Adjust the import path as needed

export const fetchApartmentsThunk = createAsyncThunk(
    'apartments/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await findAllApartments();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

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

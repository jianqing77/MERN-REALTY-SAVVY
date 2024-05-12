// apartmentsThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCoordinates, fetchRentals, fetchSales } from './apartment-api-service.js'; // Adjust the import path as needed

export const fetchRentalsThunk = createAsyncThunk(
    'apartments/fetchRentals',
    async ({ location, page }, { rejectWithValue }) => {
        try {
            const salesPayload = await fetchRentals({
                location,
                page,
            });
            return salesPayload;
        } catch (error) {
            console.error('Error in thunk fetchRentals:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSalesThunk = createAsyncThunk(
    'apartments/fetchSales',
    async ({ location, page }, { rejectWithValue }) => {
        try {
            const salesPayload = await fetchSales({
                location,
                page,
            });
            return salesPayload;
        } catch (error) {
            console.error('Error in thunk fetchSales:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCoordinatesThunk = createAsyncThunk(
    'apartments/fetchCoordinates',
    async ({ address }, { rejectWithValue }) => {
        try {
            const coordinatesPayload = await fetchCoordinates(address);
            return coordinatesPayload;
        } catch (error) {
            console.error('Error in thunk fetch Coordinates:', error);
            return rejectWithValue(error.message);
        }
    }
);

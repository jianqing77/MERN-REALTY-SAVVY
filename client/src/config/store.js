import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from '../reducers/auth-reducer';
import apartmentsReducer from '../reducers/apartmentAPI-reducer';
import userReducer from '../reducers/user-reducer';
import internalListingReducer from '../reducers/internal-listing-reducer';
const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    apartments: apartmentsReducer, // add the apartments reducer here
    'internal-listings': internalListingReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // choose which reducers to persist here
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer, // pass in reducer to be used in the component
});

export const persistor = persistStore(store);

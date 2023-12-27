import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from '../reducers/auth-reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    // add more reducers here
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

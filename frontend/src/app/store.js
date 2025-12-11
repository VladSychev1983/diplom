import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from '../reducers'; 

// Configuration for redux-persist
const persistConfig = {
  key: 'root', // Key for the storage object
  storage, // The storage type (localStorage)
  // Whitelist specifies which slices of the state to persist
  whitelist: ['counter'], // Only the 'counter' state will be saved
  // blacklist: ['user'] // Use blacklist to ignore specific reducers
};

// Wrap your root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
     reducer: persistedReducer
 });
const persistor = persistStore(store);

export { store, persistor };
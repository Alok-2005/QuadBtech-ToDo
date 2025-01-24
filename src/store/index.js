import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer, // Authentication reducer
    tasks: taskReducer, // Task-related reducer
  },
});

// RootState and AppDispatch types are removed since they are TypeScript-specific.

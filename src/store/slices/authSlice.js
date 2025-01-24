import { createSlice } from '@reduxjs/toolkit';

// Initial state for the auth slice
const initialState = {
  user: null, // Stores the user data
  isAuthenticated: false, // Tracks if the user is logged in
  loading: false, // Indicates if an authentication process is ongoing
  error: null, // Stores authentication-related errors
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action: Start the login process
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action: Login succeeded
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload; // Payload contains user data
      state.error = null;
    },
    // Action: Login failed
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Payload contains the error message
    },
    // Action: Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  // Set when the API layer silently tries to refresh an expired access
  // token and that refresh itself fails (refresh cookie expired/invalid).
  // The UI shows this once, in the same alert-modal style used everywhere
  // else, instead of the owner just silently reverting to public views.
  sessionExpiredNotice: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  sessionExpiredNotice: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    sessionExpired: (state, action: PayloadAction<string>) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.sessionExpiredNotice = action.payload;
    },
    clearSessionExpiredNotice: (state) => {
      state.sessionExpiredNotice = null;
    },
  },
});

export const { setCredentials, logout, sessionExpired, clearSessionExpiredNotice } = authSlice.actions;
export default authSlice.reducer;

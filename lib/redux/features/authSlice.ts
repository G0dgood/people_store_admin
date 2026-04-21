import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  avatar?: string;
  role: string;
  phoneNumber?: string;
  location?: string;
  biography?: string;
  dob?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, logOut, updateUser } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;

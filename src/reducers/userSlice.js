import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as auth from 'auth-provider';

const status = {
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejectedUnauthenticated',
};
const initialState = {
  status: 'idle',
  user: null,
  error: null,
};

const login = createAsyncThunk('user/login', async (form) => {
  const user = await auth.login(form);
  return user;
});

const register = createAsyncThunk('user/register', async (form) => {
  const user = await auth.register(form);
  return user;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    prefetchUser: (state, action) => {
      state.status = action.payload.status;
      state.user = action.payload.user;
      state.error = action.payload.error;
    },
    logout: (state) => {
      auth.logout();
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = status.pending;
      })
      .addCase(register.pending, (state) => {
        state.status = status.pending;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = status.resolved;
        state.user = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = status.resolved;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = status.rejected;
        state.error = action.error;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = status.rejected;
        state.error = action.error;
      });
  },
});

export const { prefetchUser, logout } = userSlice.actions;

export { login, register };

export const selectUser = (stateStore) => stateStore.user;

export default userSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as auth from 'auth-provider';

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
    prefetch: (state, action) => {
      state.status = 'resolved';
      state.user = action.payload;
    },
    logout: (state) => {
      auth.logout();
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(register.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.user = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error;
      });
  },
});

export const { prefetch, logout } = userSlice.actions;

export { login, register };

export const selectUser = (stateStore) => stateStore.user;

export default userSlice.reducer;

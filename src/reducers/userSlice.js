import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as auth from 'auth-provider';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejectedUnauthenticated',
};
const initialState = {
  status: Status.IDLE,
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
    refetchUser: (state, action) => {
      state.status = action.payload.status;
      state.user = action.payload.user;
      state.error = action.payload.error;
    },
    logout: (state) => {
      auth.logout();
      state.user = null;
    },
    resetError: (state) => {
      state.status = Status.RESOLVED;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = Status.PENDING;
        state.error = null;
      })
      .addCase(register.pending, (state) => {
        state.status = Status.PENDING;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = Status.RESOLVED;
        state.user = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = Status.RESOLVED;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = Status.REJECTED;
        state.error = action.error;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = Status.REJECTED;
        state.error = action.error;
      });
  },
});

export const { refetchUser, logout, resetError } = userSlice.actions;

export { login, register };

export const selectUser = (stateStore) => stateStore.user;

export default userSlice.reducer;

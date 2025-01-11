// src/redux/features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_LIVE_URL}/auth`;

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data) {
        // If remember me is checked, store in localStorage, else in sessionStorage
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem('rememberMe', 'true');
        } else {
          sessionStorage.setItem('user', JSON.stringify(response.data));
          localStorage.removeItem('rememberMe');
        }
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user from storage
const getStoredUser = () => {
  const rememberMe = localStorage.getItem('rememberMe');
  if (rememberMe) {
    return JSON.parse(localStorage.getItem('user'));
  }
  return JSON.parse(sessionStorage.getItem('user'));
};

const initialState = {
  user: getStoredUser(),
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  rememberMe: localStorage.getItem('rememberMe') === 'true',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    logout: (state) => {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      state.user = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.rememberMe = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  loading: false,
  error: null,
  isLoggedIn: false,
  resetPasswordRes: null,
  updatePasswordRes: null
};

const item = localStorage.getItem("item");
if (item) {
  if (item.split('.')[1]) {
    initialState.isLoggedIn = true;
    initialState.userData = JSON.parse(window.atob(item.split('.')[1]));
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.res = action.payload;
      state.userData = action.payload.userData;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.isLoggedIn = false;
      state.userData = null;
    },
    resetLoginRequest: (state) => {
      state.res = null;
    },
    resetPasswordRequest: (state) => {
      state.loading = true;
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.resetPasswordRes = action.payload;
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false;
      state.resetPasswordRes = action.payload;
    },
    resetPasswordData: (state, action) => {
      state.loading = false;
      state.resetPasswordRes = null;
    },

    updatePasswordRequest: (state) => {
      state.loading = true;
    },
    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.updatePasswordRes = action.payload;
    },
    updatePasswordFailure: (state, action) => {
      state.loading = false;
      state.updatePasswordRes = action.payload;
    },
    ressetUpadtePassword: (state, action) => {
      state.loading = false;
      state.updatePasswordRes = null;
    },

    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.isLoggedIn = false;
      state.res = null;
      state.userData = null;
    }
  }
});

export const { loginRequest, loginSuccess, loginFailure, resetLoginRequest,logoutRequest, logoutSuccess, resetPasswordRequest, resetPasswordSuccess, resetPasswordFailure, updatePasswordRequest, updatePasswordSuccess, updatePasswordFailure, resetPasswordData, ressetUpadtePassword } = authSlice.actions;

export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "checking", //"authenticated",  "non-authenticated"
    user: {},
    errorMessage: undefined,
  },
  reducers: {
    onChecking: (state) => {
      state.status = "checking";
      state.user = {};
      state.errorMessage = undefined;
    },
    onLogin: (state, { payload }) => {
      state.status = "authenticated";
      state.user = payload;
      state.errorMessage = undefined;
    },
    onLogout: (state, { payload }) => {
      state.status = "non-authenticated";
      state.user = {};
      state.errorMessage = payload;
    },
    cleanErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
  },
});

export const { onChecking, onLogin, onLogout, cleanErrorMessage } =
  authSlice.actions;

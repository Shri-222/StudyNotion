import { createSlice } from "@reduxjs/toolkit";

const getParsedItem = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value && value !== "undefined" ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const initialState = {
  signupData: null,
  loading: false,
  token: getParsedItem("token")
  // token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
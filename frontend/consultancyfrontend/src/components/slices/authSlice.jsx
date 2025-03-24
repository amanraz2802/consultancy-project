import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
  email: localStorage.getItem("email")
    ? JSON.parse(localStorage.getItem("email"))
    : null,
  name: localStorage.getItem("name")
    ? JSON.parse(localStorage.getItem("name"))
    : null,
  role: localStorage.getItem("role")
    ? JSON.parse(localStorage.getItem("role"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    logout(state) {
      state.token = null;
      state.email = null;
      state.name = null;
      state.role = null;
      localStorage.clear();
      toast.success("Logout successfully");
    },
  },
});

export const { setEmail, setToken, setName, setRole, logout } =
  authSlice.actions;
export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const initialState = {
  // token: null,
  // email: null,
  // name: null,
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
// const navigate = useNavigate();
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setToken(state, value) {
      state.token = value.payload;
    },
    setEmail(state, value) {
      state.email = value.payload;
    },
    setName(state, value) {
      state.name = value.payload;
    },
    setRole(state, value) {
      state.role = value.payload;
    },
    logout(state) {
      state.token = null;
      state.email = null;
      state.name = null;
      localStorage.clear();
      navigate("/");
      toast.success("Logout successfully");
    },
  },
});
export const { setEmail, setToken, setName, setRole, logout } =
  authSlice.actions;
export default authSlice.reducer;

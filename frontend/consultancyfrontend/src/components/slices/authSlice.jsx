import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();
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
};

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
    logout(state) {
      state.token = null;
      state.email = null;
      state.name = null;
      localStorage.clear();

      toast.success("Logout successfully");
    },
  },
});
export const { setEmail, setToken, setName, logout } = authSlice.actions;
export default authSlice.reducer;

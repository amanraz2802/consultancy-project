import { combineReducers } from "@reduxjs/toolkit";

import authSlice from "../slices/authSlice.jsx";

const rootReducer = combineReducers({
  auth: authSlice,
});

export default rootReducer;

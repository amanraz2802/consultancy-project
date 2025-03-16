import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import the provider
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import rootReducer from "./components/reducer/index.jsx";
import { configureStore } from "@reduxjs/toolkit";
import { Toaster } from "react-hot-toast";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const store = configureStore({
  reducer: rootReducer,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);

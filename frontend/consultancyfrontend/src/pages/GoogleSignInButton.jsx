import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { authenticateWithGoogle } from "../services/authServices";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import {
  setEmail,
  setToken,
  setName,
  setRole,
} from "../components/slices/authSlice.jsx"; // Import actions
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { logout } from "../slices/authSlice.jsx";

function GoogleSignInButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLoginSuccess = async (response) => {
    const token = response.credential; // Google login token
    try {
      console.log(token);
      const response = await authenticateWithGoogle(token);
      console.log(response, "here");
      // console.log(response.data.token);

      // Store in localStorage
      // may be changed later if localstorage required
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("email", JSON.stringify(response.data.data.email));
      localStorage.setItem("name", JSON.stringify(response.data.data.name));
      localStorage.setItem("role", JSON.stringify(response.data.data.role));

      // Update Redux state
      dispatch(setToken(token));
      dispatch(setEmail(response.data.data.email));
      dispatch(setName(response.data.data.name));
      dispatch(setRole(response.data.data.role));
      if (response) {
        if (response.data.data.role === "ADMIN") navigate("/admin");
        else if (
          response.data.data.role === "PI" ||
          response.data.data.role === "HOD" ||
          response.data.data.role === "DEAN"
        )
          navigate("/home");
        toast.success(response.data.message);
      }
      console.log();
    } catch (error) {
      toast.error(response.data.message);
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <GoogleLogin
        //   className="font-bold w-48 h-12"
        onSuccess={handleLoginSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}

export default GoogleSignInButton;

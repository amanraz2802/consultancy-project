import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function IndexRoute() {
  const { token, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && role === "ADMIN") {
      navigate("/admin");
    } else if (token && role === "PI") {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [token, role, navigate]);

  return null;
}

export default IndexRoute;

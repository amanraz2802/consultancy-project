import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

function PrivateRoute({ children }) {
  const { token, role } = useSelector((state) => state.auth);

  if (token !== null && role === "ADMIN") {
    return children;
  } else {
    toast.error("Not authorized as admin");
    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;

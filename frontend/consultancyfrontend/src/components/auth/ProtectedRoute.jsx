// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { token, role } = useSelector((state) => state.auth);

  if (token !== null && ["PI", "HOD", "DEAN"].includes(role)) {
    return children;
  } else {
    toast.error("Not authorized");
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;

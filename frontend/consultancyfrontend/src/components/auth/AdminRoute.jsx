// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
function AdminRoute({ children }) {
  const { token, role } = useSelector((state) => state.auth);

  if (token !== null && role === "ADMIN") {
    return children;
  } else {
    toast.error("Not authorrized");
    return <Navigate to="/login" />;
  }
}

export default AdminRoute;

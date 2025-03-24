// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminDashboard from "../admin/AdminDashboard";
import AdminApp from "../../AdminApp";
import Homepage from "../../pages/Homepage";
function OpenRoute({ children }) {
  const { token, role } = useSelector((state) => state.auth);

  if (token !== null && role == "PI") {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default OpenRoute;
// else if (token !== null && role == "ADMIN") {
//     return <AdminApp />;

import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectRoute: React.FC<{ redirect?: string }> = ({ redirect = "/login" }) => {
  const token = Cookies.get("rupkalaid");
  if (!token) return <Navigate to={redirect} />;

  return <Outlet />;
};

export default ProtectRoute;

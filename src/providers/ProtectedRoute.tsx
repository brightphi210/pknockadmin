import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  const pknockAdminToken = localStorage.getItem("pknockAdminToken");

  // const pknockAdminToken = "12345";
  useEffect(() => {
    if (!pknockAdminToken) {
      navigate("/login", { replace: true });
      return;
    }
  }, [pknockAdminToken, navigate]);

  if (!pknockAdminToken) return null;

  return <>{element}</>;
};

export default ProtectedRoute;
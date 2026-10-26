import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function Protected({ children }) {
  const { user, loading, error } = useContext(AuthContext);
  const location = useLocation();
  if (loading) return <p className="p-8" role="status">Checking your login...</p>;
  if (error) return <p className="p-8" role="alert">{error}</p>;
  if (!user) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  return children;
}

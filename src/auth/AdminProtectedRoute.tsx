import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("adminToken");

  // IF TOKEN IS MISSING, REDIRECT TO LOGIN
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  try {
    // OPTIONAL: VERIFY TOKEN EXPIRATION IF YOU WANT
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    if (payload.exp && payload.exp < now) {
      localStorage.removeItem("adminToken");
      return <Navigate to="/admin-login" replace />;
    }
  } catch (err) {
    // INVALID TOKEN
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin-login" replace />;
  }

  // TOKEN IS VALID, ALLOW ACCESS
  return <>{children}</>;
};

export default AdminProtectedRoute;

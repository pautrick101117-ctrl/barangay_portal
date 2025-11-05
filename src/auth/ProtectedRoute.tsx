// src/auth/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

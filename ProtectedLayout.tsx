import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}
const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true; // If no token, consider expired
    try {
        const { exp } = jwtDecode<{ exp: number }>(token); // Decode and get `exp`
        const currentTime = Date.now() / 1000; // Current time in seconds
        return exp < currentTime; // Check if expired
    } catch {
        return true;
    }
};

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const accessToken = secureLocalStorage.getItem("accessToken")?.toString() ?? null;
  if (isTokenExpired(accessToken)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedLayout;

// src/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import keycloak from "./keycloak";
import secureLocalStorage from "react-secure-storage";
import authServicesInstance from "./services/AuthServices";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

const isTokenExpired = (token: any): boolean => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<{ exp: number }>(token); 
    const currentTime = Date.now() / 1000;
    return exp < currentTime;
  } catch {
    return true;
};
}


  useEffect(() => {
    const initializeKeycloak = async () => {
      const authenticated = await keycloak.init({ onLoad: "login-required" });
  
      if (authenticated && keycloak.token) {
        const userID = keycloak.tokenParsed?.sub;
  
        // Check if token already exists and remove it if it is expired this fixes issue of expired tokens on 1st load
        const storedToken = secureLocalStorage.getItem("accessToken");
        const isExpired = isTokenExpired(storedToken);
        if (isExpired) {
          secureLocalStorage.removeItem("accessToken");
        }
        
        if (!storedToken || isExpired) {
          try {
            const response = await authServicesInstance.submitLogin(userID);
            const loginCredentials = response?.data?.loginCredentials;                 
            secureLocalStorage.setItem("accessToken", loginCredentials?.token);
            secureLocalStorage.setItem("userID", loginCredentials?.userId);
            secureLocalStorage.setItem("userName", loginCredentials?.userName);
            secureLocalStorage.setItem("userEmail", loginCredentials?.userEmail);
            secureLocalStorage.setItem("userType", loginCredentials?.userType);
            secureLocalStorage.setItem("tenentID", loginCredentials?.tenentID);
            secureLocalStorage.setItem("subTenentID", loginCredentials?.subTenentID);
            secureLocalStorage.setItem("expiresIn", loginCredentials?.expiresIn);
            secureLocalStorage.setItem("systemRole", loginCredentials?.systemRole);
            console.log("idididid",);
            
  
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Login error:", error);
            keycloak.logout({ redirectUri: window.location.origin });
            secureLocalStorage.clear();
            setIsAuthenticated(false);
          }
        } else {
          // User already authenticated from storage
          setIsAuthenticated(true);
        }
      }
    };
  
    initializeKeycloak();
  }, []);

  //Logic for refresh token -> calls login api with keycloak id
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        const refreshed = await keycloak.updateToken(500);
        if (!refreshed) {
          console.warn("Token expired. Attempting silent login...");
          await keycloak.login({ redirectUri: window.location.origin });
        } else {          
          if(keycloak.token){
            const userID = keycloak.tokenParsed?.sub;
            try {
              const response = await authServicesInstance.submitLogin(userID);
              const loginCredentials = response?.data?.loginCredentials;
              secureLocalStorage.removeItem("accessToken");
              secureLocalStorage.setItem("accessToken", loginCredentials?.token);
              secureLocalStorage.setItem("expiresIn", loginCredentials?.expiresIn);    
            } catch (error) {
              console.error("Login error:", error);
              keycloak.logout({ redirectUri: window.location.origin });
              secureLocalStorage.clear();
              setIsAuthenticated(false);
            }
          }
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        keycloak.logout({ redirectUri: window.location.origin });
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes
  
    return () => clearInterval(refreshInterval); // Cleanup on unmount
  }, []);

  const logout = () => {
    secureLocalStorage.clear();
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {isAuthenticated && <>{children}</>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

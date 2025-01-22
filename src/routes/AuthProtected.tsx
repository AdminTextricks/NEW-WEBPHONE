import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthProtected = ({ children }: { children: React.ReactNode }) => {
  const isUserLogin = useSelector((state: any) => state.Login.isUserLogin);

  if (!isUserLogin) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export { AuthProtected };

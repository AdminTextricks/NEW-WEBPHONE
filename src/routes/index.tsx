import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DefaultLayout from "../layouts/Default/index";
import NonAuthLayout from "../layouts/NonAuth/index";
import { AuthProtected } from "./AuthProtected";
import { publicRoutes, privateRoutes } from "./allRoutes";

const Index = () => {
  const isUserLogin = useSelector((state: any) => state.Login.isUserLogin);

  return (
    <React.Fragment>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map((route: any, idx: number) => (
          <Route
            key={idx}
            path={route.path}
            element={
              isUserLogin ? (
                <Navigate to="/dashboard" />
              ) : (
                <NonAuthLayout>{route.component}</NonAuthLayout>
              )
            }
          />
        ))}

        {/* Private Routes */}
        {privateRoutes.map((route: any, idx: number) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <AuthProtected>
                <DefaultLayout>{route.component}</DefaultLayout>
              </AuthProtected>
            }
          />
        ))}
      </Routes>
    </React.Fragment>
  );
};

export default Index;

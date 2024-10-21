import React from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const token = Cookies.get("token");
  const location = useLocation();
  console.log("have User");
  if (!currentUser || !token) {
    console.log("dont have User");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;

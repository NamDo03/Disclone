import React from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const token = Cookies.get("token");
  console.log("have User");
  if (!currentUser || !token) {
    console.log("dont have User");
    return <Navigate to="/sign-in" />;
  }
  return children;
};

export default ProtectedRoute;

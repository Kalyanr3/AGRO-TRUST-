import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const retailer = JSON.parse(localStorage.getItem("retailer"));
  const farmer = JSON.parse(localStorage.getItem("farmer"));
  const location = useLocation();

  // 🧭 Handle retailer-only routes
  if (role === "retailer") {
    if (!retailer) {
      // If farmer is logged in, redirect them to farmer dashboard
      if (farmer) return <Navigate to="/farmer/dashboard" replace />;
      // Otherwise, send to retailer login
      return <Navigate to="/retailer/login" state={{ from: location }} replace />;
    }
  }

  // 🧭 Handle farmer-only routes
  if (role === "farmer") {
    if (!farmer) {
      // If retailer is logged in, redirect to retailer dashboard
      if (retailer) return <Navigate to="/retailer/dashboard" replace />;
      // Otherwise, send to farmer login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // ✅ If user is authenticated with correct role, allow access
  return children;
};

export default ProtectedRoute;


import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";

export default function ProtectedRoute() {
  const { user } = useAuthStore();
  if (user === null) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
}

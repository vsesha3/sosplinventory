import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {
  clearAuth, getToken, getTokenExpiry, hasValidToken, redirectToLogin,
} from '../utils/tokenUtils';

const ProtectedRoute: React.FC = () => {
  const valid = hasValidToken();

  // Log out automatically the moment the JWT expires
  useEffect(() => {
    if (!valid) return;
    const token = getToken();
    const expiry = token ? getTokenExpiry(token) : null;
    if (expiry == null) return;
    const timer = setTimeout(redirectToLogin, Math.max(0, expiry - Date.now()));
    return () => clearTimeout(timer);
  }, [valid]);

  if (!valid) {
    clearAuth();   // drop any expired/stale token
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;

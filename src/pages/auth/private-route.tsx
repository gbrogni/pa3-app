import { useAuth } from '@/context/auth-provider';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  restricted?: boolean;
}

export function PrivateRoute({ children, restricted = false }: PrivateRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return restricted && !isAuthenticated ? (
    <Navigate to="/auth/sign-in" state={{ from: location }} replace />
  ) : (
    children
  );
}
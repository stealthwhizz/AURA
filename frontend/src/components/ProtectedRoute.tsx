import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute;

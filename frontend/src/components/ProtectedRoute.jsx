import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const location = useLocation();

  const isAuthorized = user && (!allowedRoles || allowedRoles.includes(user.role));

  useEffect(() => {
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      addToast(
        `Access Denied: ${user.role.toUpperCase()} role is not permitted to access this portal.`,
        'error',
        'Unauthorized'
      );
    }
  }, [user, allowedRoles, location.pathname]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    // Redirect to the user's authorized role panel
    let destination = '/';
    if (user.role === 'citizen') destination = '/citizen-dashboard';
    else if (user.role === 'officer') destination = '/officer-dashboard';
    else if (user.role === 'admin') destination = '/admin-dashboard';

    return <Navigate to={destination} replace />;
  }

  return children;
};

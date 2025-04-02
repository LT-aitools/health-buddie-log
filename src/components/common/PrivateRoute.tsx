// src/components/common/PrivateRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Log authentication state for debugging
  useEffect(() => {
    console.log('PrivateRoute auth state:', { isAuthenticated, isLoading, hasUser: !!user });
    
    // Check if we have a stored user but the phone number is missing
    const userJson = localStorage.getItem('healthBuddieUser');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        console.log('User from localStorage:', userData);
        if (!userData.phoneNumber) {
          console.warn('User data missing phone number!');
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="relative h-16 w-16">
          <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    console.log('Not authenticated, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  console.log('Authenticated, rendering protected component');
  return <>{children}</>;
};

export default PrivateRoute;
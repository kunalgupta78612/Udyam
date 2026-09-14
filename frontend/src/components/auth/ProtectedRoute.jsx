import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../api/hooks/useAuth';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            border: '3px solid var(--color-primary-100, #E0E7FF)',
            borderTopColor: 'var(--color-primary, #4F46E5)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
          Authenticating session...
        </span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

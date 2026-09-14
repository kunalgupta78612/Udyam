import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './api/queryClient';
import { AuthProvider } from './api/hooks/useAuth';
import { TranslationProvider } from './hooks/useTranslation';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import IntakeWizard from './pages/IntakeWizard';
import ResultsPage from './pages/ResultsPage';
import TrackerPage from './pages/TrackerPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/intake" element={<IntakeWizard />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/tracker" element={<TrackerPage />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

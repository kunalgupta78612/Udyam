import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { authKeys } from '../queryKeys';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem('udyam_token'); } catch { return null; }
  });
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: authKeys.user(),
    queryFn: () => apiClient.getMe(),
    enabled: !!token,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => apiClient.login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('udyam_token', data.token);
      setToken(data.token);
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data) => apiClient.register(data),
    onSuccess: (data) => {
      localStorage.setItem('udyam_token', data.token);
      setToken(data.token);
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });

  const logout = useCallback(() => {
    localStorage.removeItem('udyam_token');
    setToken(null);
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{
      user: user || null,
      token,
      isLoading,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === 'admin',
      login: loginMutation.mutateAsync,
      register: registerMutation.mutateAsync,
      loginMutation,
      registerMutation,
      logout,
      loginError: loginMutation.error,
      registerError: registerMutation.error,
      isLoginLoading: loginMutation.isPending,
      isRegisterLoading: registerMutation.isPending,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

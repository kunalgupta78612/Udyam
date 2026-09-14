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

  const { data: user, isLoading, isError } = useQuery({
    queryKey: authKeys.user(),
    queryFn: () => apiClient.getMe(),
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      try {
        localStorage.removeItem('udyam_token');
      } catch (e) {
        console.warn('Failed to clear udyam_token:', e);
      }
      setToken(null);
    }
  }, [isError]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password, role }) => apiClient.login(email, password, role),
    onSuccess: (data) => {
      localStorage.setItem('udyam_token', data.token);
      setToken(data.token);
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });

  const login = useCallback(
    (emailOrObj, password, role) => {
      if (typeof emailOrObj === 'object' && emailOrObj !== null) {
        return loginMutation.mutateAsync(emailOrObj);
      }
      return loginMutation.mutateAsync({ email: emailOrObj, password, role });
    },
    [loginMutation]
  );

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
      login,
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

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { schemeKeys } from '../queryKeys';

export function usePublicSchemes(params = {}) {
  return useQuery({
    queryKey: [...schemeKeys.publicList(), params],
    queryFn: () => apiClient.getPublicSchemes(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSchemeDetail(schemeId) {
  return useQuery({
    queryKey: schemeKeys.detail(schemeId),
    queryFn: () => apiClient.getSchemeById(schemeId),
    enabled: !!schemeId,
  });
}

export function useUserMatches(profile) {
  return useQuery({
    queryKey: [...schemeKeys.userMatches(profile?.id || 'guest'), profile],
    queryFn: () => apiClient.matchSchemes(profile),
    enabled: !!profile,
  });
}

export function useSavedSchemes() {
  return useQuery({
    queryKey: schemeKeys.saved('current'),
    queryFn: () => apiClient.getSavedSchemes(),
  });
}

export function useToggleSaveScheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ schemeId, status }) => apiClient.toggleSaveScheme(schemeId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schemeKeys.saved('current') });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ schemeId, status, notes }) => 
      apiClient.updateApplicationStatus(schemeId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schemeKeys.saved('current') });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { schemeKeys } from '../queryKeys';

export function useAdminSchemes(params = {}) {
  return useQuery({
    queryKey: [...schemeKeys.adminList(), params],
    queryFn: () => apiClient.getAdminSchemes(params),
  });
}

export function usePendingQueue() {
  return useQuery({
    queryKey: schemeKeys.pending(),
    queryFn: () => apiClient.getPendingQueue(),
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: schemeKeys.analytics(),
    queryFn: () => apiClient.getAdminAnalytics(),
  });
}

export function useSchemeHistory(schemeId) {
  return useQuery({
    queryKey: schemeKeys.history(schemeId),
    queryFn: () => apiClient.getSchemeHistory(schemeId),
    enabled: !!schemeId,
  });
}

export function useCreateScheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schemeData) => apiClient.createScheme(schemeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schemeKeys.adminList() });
      queryClient.invalidateQueries({ queryKey: schemeKeys.analytics() });
    },
  });
}

export function useUpdateScheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ schemeId, data }) => apiClient.updateScheme(schemeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: schemeKeys.adminList() });
      queryClient.invalidateQueries({ queryKey: schemeKeys.detail(variables.schemeId) });
      queryClient.invalidateQueries({ queryKey: schemeKeys.history(variables.schemeId) });
    },
  });
}

export function useReviewScheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ queueId, action, notes, modifiedData }) => 
      apiClient.reviewPendingScheme(queueId, action, notes, modifiedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schemeKeys.pending() });
      queryClient.invalidateQueries({ queryKey: schemeKeys.adminList() });
      queryClient.invalidateQueries({ queryKey: schemeKeys.analytics() });
    },
  });
}

export function useTriggerIngestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sourceUrl, sourceName }) => 
      apiClient.triggerIngestion(sourceUrl, sourceName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schemeKeys.pending() });
    },
  });
}

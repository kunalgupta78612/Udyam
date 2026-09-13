import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { profileKeys } from '../queryKeys';

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: () => apiClient.getCurrentProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileData) => apiClient.saveProfile(profileData),
    onSuccess: (savedData) => {
      queryClient.setQueryData(profileKeys.current(), savedData);
    },
  });
}

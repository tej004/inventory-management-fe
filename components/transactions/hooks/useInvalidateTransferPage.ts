import { useQueryClient } from '@tanstack/react-query';

export function useInvalidateTransferPage() {
  const queryClient = useQueryClient();

  return () => {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ['transfers', 'approved'] }),
      queryClient.invalidateQueries({ queryKey: ['transfers', 'pending'] }),
      queryClient.invalidateQueries({ queryKey: ['transfers', 'received'] }),
      queryClient.invalidateQueries({ queryKey: ['transfers', 'rejected'] }),
    ]);
  };
}

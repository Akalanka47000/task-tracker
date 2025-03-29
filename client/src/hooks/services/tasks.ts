import { taskService } from '@/services';
import { useAuthStore } from '@/store/auth';
import { GetPaginatedQueryProps } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetTasks({ page, limit, params = {} }: GetPaginatedQueryProps) {
  const profile = useAuthStore((state) => state.profile);
  const query = useQuery({
    queryKey: ['tasks', ...Object.values(params), ...(page ? [page] : []), profile?.id],
    queryFn: () =>
      taskService
        .getTasks({
          options: {
            params: {
              page,
              limit,
              ...params
            }
          }
        })
        .then((res) => res.data),
    retry: 1,
    placeholderData: keepPreviousData
  });
  return query;
}

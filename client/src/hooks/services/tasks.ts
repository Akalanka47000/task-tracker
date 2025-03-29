import { taskService } from '@/services';
import { useAuthStore } from '@/store/auth';
import { GetPaginatedQueryProps } from '@/types';
import { filterAndNotifyError } from '@/utils';
import { addToast } from '@heroui/react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export function useToggleTaskStatus(task: ITask) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return taskService.updateTask({ id: task.id, data: { completed: !task.completed } });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['tasks'] });
      addToast({
        title: `Task ${task.completed ? 'reset successfully' : 'marked as completed'}`,
        color: 'success'
      });
    },
    onError: filterAndNotifyError
  });
}

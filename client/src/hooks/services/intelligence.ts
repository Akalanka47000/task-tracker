import { intelligenceService } from '@/services';
import { GetPaginatedQueryProps, GetQueryProps } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetEmployeeInsights({ page, limit, params = {}, onSuccess }: GetPaginatedQueryProps) {
  const query = useQuery({
    queryKey: ['employee-insights', ...Object.values(params), ...(page ? [page] : [])],
    queryFn: () =>
      intelligenceService
        .getEmployeeInsights({
          options: {
            params: {
              page,
              limit,
              ...params
            }
          }
        })
        .then((res) => {
          onSuccess?.(res.data);
          return res.data;
        }),
    retry: 1,
    placeholderData: keepPreviousData
  });
  return query;
}

export function useGetSystemInsights({ params = {} }: GetQueryProps) {
  const query = useQuery({
    queryKey: ['system-insights', ...Object.values(params)],
    queryFn: () =>
      intelligenceService
        .getSystemInsights({
          options: {
            params
          }
        })
        .then((res) => res.data),
    retry: 1,
    placeholderData: keepPreviousData
  });
  return query;
}

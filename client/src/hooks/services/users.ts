import { userService } from '@/services';
import { GetPaginatedQueryProps } from '@/types';
import { UserRole } from '@shared/constants';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetEmployees({ page, limit, params = {} }: GetPaginatedQueryProps) {
  const query = useQuery({
    queryKey: ['users', ...Object.values(params), ...(page ? [page] : [])],
    queryFn: () =>
      userService
        .getUsers({
          options: {
            params: {
              page,
              limit,
              filter: {
                role: UserRole.Employee
              },
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

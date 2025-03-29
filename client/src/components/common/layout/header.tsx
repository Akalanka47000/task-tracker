import { HTMLProps } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ListTodo } from 'lucide-react';
import { ROUTE_HOME, ROUTE_LOGIN } from '@/constants';
import { useGetProfile } from '@/hooks/services/auth';
import { authService } from '@/services';
import { resetStores } from '@/store';
import { cn } from '@/utils';
import { addToast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Skeleton } from '../core';

export function Header({ className, ...props }: HTMLProps<HTMLHeadElement>) {
  const client = useQueryClient();
  const { data: profile, isLoading } = useGetProfile();

  const navigate = useNavigate();

  const logout = useMutation({
    mutationFn: () => {
      return authService.logout().then((result) => {
        addToast({ title: result.message, color: 'success' });
      });
    },
    onSettled: () => {
      resetStores();
      client.invalidateQueries({ queryKey: ['auth'] });
      navigate(ROUTE_LOGIN);
    }
  });

  return (
    <header
      className={cn('w-full h-24 px-8 sm:px-10 flex justify-between items-center bg-black', className)}
      {...props}>
      <Link to={ROUTE_HOME}>
        <ListTodo className="sm:hidden mx-auto text-md p-2.5 border-1 border-primary/60 rounded-md" size={40} />
        <h3 className="hidden sm:block text-lg md:text-2xl text-start tracking-wider">Task Tracker</h3>
      </Link>
      <div className="flex gap-5 justify-center items-center">
        {isLoading ? (
          <>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-2.5 w-32" />
            </div>
            <Skeleton className="h-8 sm:h-10 w-36" />
          </>
        ) : (
          profile && (
            <>
              <div className="flex flex-col items-end">
                <span className="text-primary text-xs md:text-sm">
                  {profile.first_name}
                  {profile.last_name}
                </span>
                <span className="text-white text-xs md:text-xs">{profile.role}</span>
              </div>
              <Button className="sm:w-36" isLoading={logout.isPending} onPress={logout.mutate as any} variant="flat">
                Logout
              </Button>
            </>
          )
        )}
      </div>
    </header>
  );
}

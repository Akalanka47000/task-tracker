import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { z } from 'zod';
import { Button, Form, FormField, FormInput } from '@/components';
import { ROUTE_DASHBOARD } from '@/constants';
import { authService } from '@/services';
import { useAuthStore } from '@/store/auth';
import { filterAndNotifyError } from '@/utils';
import { addToast } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { default as FormSchema } from './schema';

export function LoginForm() {
  const navigate = useNavigate();

  const setProfile = useAuthStore((state) => state.setProfile);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      return await authService.login({ data });
    },
    onSuccess: (result) => {
      addToast({ title: result.message, color: 'success' });
      setProfile(result.data);
      navigate(ROUTE_DASHBOARD);
    },
    onError: filterAndNotifyError
  });

  return (
    <>
      <Form {...form}>
        <form className="w-full flex flex-col gap-6" onSubmit={form.handleSubmit(loginMutation.mutate as any)}>
          <div className="flex flex-col gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormInput label="Username" startContent={<User className="w-4 h-4" />} {...field} />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput label="Password" startContent={<Lock className="w-4 h-4" />} type="password" {...field} />
              )}
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-1 text-sm text-center text-gray-500">
            <span>You can use the following test credentials to login:</span>
            <span>
              Username: <span className="text-primary">admin</span>
            </span>
            <span>
              Password: <span className="text-primary">Ackg82!2#secret</span>
            </span>
          </div>
          <Button isLoading={loginMutation.isPending} type="submit" isDisabled={!form.formState.isValid}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}

export default LoginForm;

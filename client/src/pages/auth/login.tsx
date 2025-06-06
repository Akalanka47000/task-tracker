import { ListTodo } from 'lucide-react';
import { RedirectIfAuthenticated } from '@/components/auth';
import { LoginForm } from '@/components/auth/login';

function Login() {
  return (
    <div className="container flex justify-center px-10 sm:px-12 pt-0 sm:pt-0">
      <div className="flex flex-col gap-6 max-w-lg p-10 sm:p-12 border-[0.5px] border-white/60 rounded-md w-full">
        <ListTodo className="mx-auto text-md p-2.5 border-1 border-primary/60 rounded-md" size={50} />
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <h1>Welcome!</h1>
          <h3>Back</h3>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default RedirectIfAuthenticated(Login);

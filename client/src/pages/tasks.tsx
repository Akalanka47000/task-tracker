import { useSearchParams } from 'react-router-dom';
import { Protect } from '@/components/auth';
import { TaskTable } from '@/components/tasks';

function Tasks() {
  const [searchParams] = useSearchParams();
  return (
    <div className="flex w-full h-full flex-1 flex-col space-y-8 p-8 md:p-10">
      <TaskTable employeeId={searchParams.get('employee_id')} />
    </div>
  );
}

export default Protect(Tasks);

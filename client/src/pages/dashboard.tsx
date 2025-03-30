import { UserRole } from '@shared/constants';
import { Analytics } from '@/components/analytics';
import { Protect } from '@/components/auth';
import { EmployeeTable } from '@/components/employees';
import { TaskTable } from '@/components/tasks';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/utils';
import { Tab, Tabs } from '@heroui/react';

export function Dashboard() {
  const profile = useAuthStore((state) => state.profile);
  return (
    <div
      className={cn(
        'flex w-full h-full flex-1 flex-col space-y-8 p-8 md:p-10',
        profile?.role === UserRole.Administrator && 'pt-0 md:pt-0'
      )}>
      {profile?.role === UserRole.Administrator ? (
        <Tabs
          classNames={{
            base: 'flex justify-center items-start',
            panel: '!mt-3'
          }}
          aria-label="Sections">
          <Tab key="analytics" title="Analytics">
            <Analytics />
          </Tab>
          <Tab key="employees" title="Employees">
            <EmployeeTable />
          </Tab>
        </Tabs>
      ) : (
        <TaskTable />
      )}
    </div>
  );
}

export default Protect(Dashboard);

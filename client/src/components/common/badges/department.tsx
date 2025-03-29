import { EmployeeDepartment } from '@shared/constants';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils';

const priorityVariants = cva('px-[.5rem] py-[.2rem] border text-xs rounded-full text-nowrap', {
  variants: {
    variant: {
      [EmployeeDepartment.HR]: 'bg-orange-500/10 border border-orange-500/10 text-orange-500',
      [EmployeeDepartment.IT]: 'bg-blue-500/10 border border-blue-500/10 text-blue-500',
      [EmployeeDepartment.Sales]: 'bg-purple-500/10 border border-purple-500/10 text-purple-500',
      [EmployeeDepartment.Marketing]: 'bg-pink-500/10 border border-pink-500/10 text-pink-500'
    }
  }
});

export function DepartmentBadge({ department }: { department: EmployeeDepartment }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-[.15rem] text-xs w-fit cursor-default',
        priorityVariants({ variant: department })
      )}>
      {department}
    </span>
  );
}

export default DepartmentBadge;

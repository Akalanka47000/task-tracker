import { UseFormReturn } from 'react-hook-form';
import { EmployeeDepartment } from '@shared/constants';
import { z } from 'zod';
import { FormField, FormInput, FormSelect } from '@/components';
import { cn } from '@/utils';
import { SelectItem } from '@heroui/react';
import { FormSchema } from './schema';

export * from './schema';

export default function TaskForm({
  form,
  className
}: {
  form: UseFormReturn<z.infer<typeof FormSchema>>;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:gap-4', className)}>
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => <FormInput label="First name" placeholder="Enter first name" {...field} />}
      />
      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => <FormInput label="Last name" placeholder="Enter last name" {...field} />}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => <FormInput label="Username" placeholder="Username" {...field} />}
      />
      <FormField
        control={form.control}
        name="details.department"
        render={({ field }) => (
          <FormSelect label="Department" placeholder="Select department" defaultSelectedKeys={[field.value]} {...field}>
            {Object.values(EmployeeDepartment).map((department) => (
              <SelectItem key={department}>{department}</SelectItem>
            ))}
          </FormSelect>
        )}
      />
    </div>
  );
}

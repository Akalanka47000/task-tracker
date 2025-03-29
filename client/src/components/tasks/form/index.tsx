import { UseFormReturn } from 'react-hook-form';
import { Priority } from '@shared/constants';
import { z } from 'zod';
import { FormField, FormInput, FormSelect, FormTextArea } from '@/components';
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
        name="name"
        render={({ field }) => <FormInput label="Name" placeholder="Enter name" {...field} />}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => <FormTextArea label="Description" placeholder="Enter description" {...field} />}
      />
      <FormField
        control={form.control}
        name="priority"
        render={({ field }) => (
          <FormSelect
            label="Priority"
            placeholder="Select priority"
            defaultSelectedKeys={[field.value]}
            {...field}
            onChange={(e) => field.onChange(Number(e.target.value))}>
            {Object.values(Priority)
              .filter(Number)
              .map((priority) => (
                <SelectItem key={priority}>{Priority[priority as number]}</SelectItem>
              ))}
          </FormSelect>
        )}
      />
      <FormField
        control={form.control}
        name="due_date"
        render={({ field }) => (
          <FormInput
            label="Due date"
            type="date"
            placeholder=" "
            min={new Date().toISOString().slice(0, 10)}
            {...(field as any)}
          />
        )}
      />
    </div>
  );
}

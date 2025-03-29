import { Priority } from '@shared/constants';
import { z } from 'zod';

export const FormSchema = z.object({
  name: z.string(),
  description: z.string(),
  due_date: z.coerce.date(),
  priority: z.nativeEnum(Priority, { required_error: 'Please select a priority' })
});

import { Priority } from '@shared/constants';
import { z } from 'zod';

export const FormSchema = z.object({
  name: z.string(),
  description: z.string(),
  priority: z.nativeEnum(Priority)
});

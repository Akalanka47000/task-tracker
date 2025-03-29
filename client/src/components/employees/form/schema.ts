import { EmployeeDepartment } from '@shared/constants';
import { z } from 'zod';

export const FormSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  details: z.object({
    department: z.nativeEnum(EmployeeDepartment, { required_error: 'Please select a department' })
  })
});

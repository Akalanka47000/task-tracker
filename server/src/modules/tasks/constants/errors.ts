import { BadRequestException, NotFoundException } from '@nestjs/common';

export const ERRORS = {
  TASK_NOT_FOUND: new NotFoundException('Task not found'),
  INVALID_EMPLOYEE_ID: new BadRequestException('Employee ID is not of a valid employee role')
};

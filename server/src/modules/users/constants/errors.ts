import { NotFoundException } from '@nestjs/common';

export const ERRORS = {
  USER_NOT_FOUND: new NotFoundException('User not found')
};

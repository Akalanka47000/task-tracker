import { Request } from 'express';
import { UserRole } from '@shared/constants';
import { ERRORS as AUTH_ERRORS } from '@/modules/auth/constants';
import { ERRORS } from '@/modules/tasks/constants';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TaskService } from '../../service';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private readonly service: TaskService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: Request = ctx.switchToHttp().getRequest();
    const task = await this.service.getById(request.params.id);
    if (!task) {
      throw ERRORS.TASK_NOT_FOUND;
    }
    const user = request.user as IUser;
    if (user.role === UserRole.Employee && user.id !== task.employee_id) {
      throw AUTH_ERRORS.FORBIDDEN_ROUTE;
    }
    return true;
  }
}

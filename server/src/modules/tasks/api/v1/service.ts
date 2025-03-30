import { UserRole } from '@shared/constants';
import { traced } from '@sliit-foss/functions';
import { NotificationService } from '@/modules/notifications/api/v1/service';
import { UserService } from '@/modules/users/api/v1/service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERRORS } from '../../constants';
import { Task } from '../../models';
import { TaskRepository } from '../../repository';

const layer = 'repository';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository) private repository: TaskRepository,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  async create(task: Partial<Task>) {
    const user = await this.userService.getById(task.employee_id as string);
    if (user?.role !== UserRole.Employee) {
      throw ERRORS.INVALID_EMPLOYEE_ID;
    }
    return traced[layer](preserveContext(this.repository, 'save'))(task).then((newlyCreatedTask) => {
      this.notificationService.sendTaskAssignmentNotification(newlyCreatedTask);
      return newlyCreatedTask;
    });
  }

  getAll(retrievalOptions: QueryOptions<Task>) {
    return traced[layer](preserveContext(this.repository, 'findAll'))(retrievalOptions);
  }

  getById(id: string) {
    return traced[layer](preserveContext(this.repository, 'findByID'))(id);
  }

  async updateById(id: string, data: Partial<Task>, user: IUser) {
    if (data.employee_id) {
      const user = await this.userService.getById(data.employee_id as string);
      if (user?.role !== UserRole.Employee) {
        throw ERRORS.INVALID_EMPLOYEE_ID;
      }
    }
    return traced[layer](preserveContext(this.repository, 'updatebyID'))(id, data).then((result) => {
      if (user.role === UserRole.Employee && result?.completed) {
        this.notificationService.sendTaskCompletionNotification(result);
      }
      return result;
    });
  }

  deleteById(id: string) {
    return traced[layer](preserveContext(this.repository, 'delete'))(id);
  }
}

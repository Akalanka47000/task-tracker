import { EmployeeDepartment } from '@shared/constants';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../tasks/models';
import { TaskRepository } from '../tasks/repository';
import { User } from '../users/models';
import { UserRepository } from '../users/repository';
import { GetPaginatedSummarySchema } from './api/v1/schema';

@Injectable()
export class IntelligenceRepository {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository
  ) {}

  getSystemSummaryByDepartment(department?: EmployeeDepartment) {
    let employeeCountQuery = this.userRepository.createQueryBuilder();
    if (department) {
      employeeCountQuery = employeeCountQuery.where(`details->>'department' = :department`, { department });
    }

    let tasksQuery = this.taskRepository.createQueryBuilder('tasks');

    if (department) {
      tasksQuery = tasksQuery
        .innerJoin(User, 'users', 'users.id = tasks.employee_id')
        .where(`users.details->>'department' = :department`, { department });
    }

    const completedTasksQuery = tasksQuery.clone().where('tasks.completed = :completed', { completed: true });

    const overDueTasksQuery = tasksQuery
      .clone()
      .where('tasks.completed = :completed', { completed: false })
      .where('tasks.due_date <= NOW()');

    return Promise.all([
      employeeCountQuery.getCount(),
      tasksQuery.getCount(),
      completedTasksQuery.getCount(),
      overDueTasksQuery.getCount()
    ]);
  }

  getEmployeeSummaryByDepartment({ page, limit, filter }: GetPaginatedSummarySchema) {
    return this.userRepository.paginate({
      page,
      limit,
      query: async (opts) => {
        let query = this.userRepository.createQueryBuilder().select('id').setFindOptions({ order: opts.order });

        if (filter?.department) {
          query = query.where(`details->>'department' = :department`, { department: filter.department });
        }

        const [ids, count] = await Promise.all([query.skip(opts.skip).take(opts.take).getRawMany(), query.getCount()]);

        const aggreagateResults = await this.userRepository
          .createQueryBuilder('users')
          .andWhereInIds(ids)
          .leftJoin(Task, 'tasks', 'tasks.employee_id = users.id')
          .select([
            'users.id as id',
            'users.first_name as first_name',
            'users.last_name as last_name',
            'users.username as username',
            'users.details as details',
            'CAST(COUNT(tasks.id) as INT) as total_tasks',
            'CAST(COUNT(CASE WHEN tasks.completed = true THEN 1 END) as INT) as completed_tasks',
            'CAST(COUNT(CASE WHEN tasks.due_date < NOW() AND tasks.completed = false THEN 1 END) AS INT) as overdue_tasks',
            'CAST(CASE WHEN COUNT(tasks.id) > 0 THEN ROUND(COUNT(CASE WHEN tasks.completed = true THEN 1 END) * 100.0 / COUNT(tasks.id), 2) ELSE 0 END as INT) as completion_percentage'
          ])
          .groupBy('users.id')
          .setFindOptions({ order: opts.order })
          .getRawMany();

        return Promise.all([aggreagateResults, count]) as Promise<[any[], number]>;
      }
    });
  }
}

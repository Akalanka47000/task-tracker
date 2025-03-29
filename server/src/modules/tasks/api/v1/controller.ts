import { Request } from 'express';
import { UserRole } from '@shared/constants';
import { AdminProtect, FormattedResponse, Protect } from '@/middleware';
import { ERRORS as AUTH_ERRORS } from '@/modules/auth/constants';
import { QuerySchema, UUIDSchema } from '@/utils';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ERRORS } from '../../constants';
import { Task } from '../../models';
import { SelfGuard } from './middleware';
import { CreateTaskSchema, UpdateTaskSchema } from './schema';
import { TaskService } from './service';

@ApiTags('Tasks')
@Controller({ path: 'tasks', version: '1' })
@UseGuards(Protect)
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Post()
  @UseGuards(AdminProtect)
  async create(@Body() payload: CreateTaskSchema) {
    const task = await this.service.create(payload);
    return FormattedResponse.send({
      message: 'Task added successfully!',
      data: task
    });
  }

  @Get()
  async getAll(@Query() query: QuerySchema<Task>) {
    const result = await this.service.getAll(query);
    return FormattedResponse.send({
      message: 'Tasks fetched successfully!',
      data: result
    });
  }

  @Get(':id')
  @UseGuards(SelfGuard)
  async getById(@Param() params: UUIDSchema) {
    const task = await this.service.getById(params.id);
    if (!task) throw ERRORS.TASK_NOT_FOUND;
    return FormattedResponse.send({
      message: 'Task fetched successfully!',
      data: task
    });
  }

  @Patch(':id')
  @UseGuards(SelfGuard)
  async updateTaskById(@Req() req: Request, @Param() params: UUIDSchema, @Body() payload: UpdateTaskSchema) {
    if (
      req.user!.role === UserRole.Employee &&
      (Object.keys(payload).length > 1 || Object.keys(payload)[0] !== 'completed')
    ) {
      throw AUTH_ERRORS.FORBIDDEN_ACTION;
    }
    const task = await this.service.updateById(params.id, payload);
    if (!task) throw ERRORS.TASK_NOT_FOUND;
    return FormattedResponse.send({
      message: 'Task updated successfully!',
      data: task
    });
  }

  @Delete(':id')
  @UseGuards(AdminProtect)
  async deleteTaskById(@Param() params: UUIDSchema) {
    const result = await this.service.deleteById(params.id);
    if (!result.affected) throw ERRORS.TASK_NOT_FOUND;
    return FormattedResponse.send({ message: 'Task deleted successfully!' });
  }
}

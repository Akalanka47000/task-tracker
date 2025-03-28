import { FormattedResponse } from '@/middleware';
import { QuerySchema, UUIDSchema } from '@/utils';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ERRORS } from '../../constants';
import { User } from '../../models';
import { CreateUserSchema, UpdateUserSchema } from './schema';
import { UserService } from './service';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async create(@Body() payload: CreateUserSchema) {
    const user = await this.service.create(payload);
    return FormattedResponse.send({
      message: 'User added successfully!',
      data: user
    });
  }

  @Get()
  async getAll(@Query() query: QuerySchema<User>) {
    const result = await this.service.getAll(query);
    return FormattedResponse.send({
      message: 'Users fetched successfully!',
      data: result
    });
  }

  @Get(':id')
  async getById(@Param() params: UUIDSchema) {
    const user = await this.service.getById(params.id);
    if (!user) throw ERRORS.USER_NOT_FOUND;
    return FormattedResponse.send({
      message: 'User fetched successfully!',
      data: user
    });
  }

  @Patch(':id')
  async updateUserById(@Param() params: UUIDSchema, @Body() payload: UpdateUserSchema) {
    const user = await this.service.updateById(params.id, payload);
    if (!user) throw ERRORS.USER_NOT_FOUND;
    return FormattedResponse.send({
      message: 'User updated successfully!',
      data: user
    });
  }

  @Delete(':id')
  async deleteUserById(@Param() params: UUIDSchema) {
    const result = await this.service.deleteById(params.id);
    if (!result.affected) throw ERRORS.USER_NOT_FOUND;
    return FormattedResponse.send({ message: 'User deleted successfully!' });
  }
}

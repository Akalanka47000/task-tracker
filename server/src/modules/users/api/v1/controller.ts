import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { traced } from '@sliit-foss/functions';
import { CreateUserSchema, UpdateUserSchema } from './schema';
import { UserService } from './service';
import { ERRORS } from '../../constants';
import { FormattedResponse } from '@/middleware';
import { QuerySchema, UUIDSchema } from '@/utils';
import { User } from '../../models';

const layer = "service"

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly service: UserService) { }

  @Post()
  async create(@Body() payload: CreateUserSchema) {
    const user = await traced[layer](this.service.create)(payload);
    return FormattedResponse.send({
      message: 'User added successfully!',
      data: user,
    });
  }

  @Get()
  async getAll(@Query() query: QuerySchema<User>) {
    const result = await this.service.getAll(query);
    return FormattedResponse.send({
      message: 'Users fetched successfully!',
      data: result,
    });
  }

  @Get(':id')
  async getById(@Param() params: UUIDSchema) {
    const user = await traced[layer](this.service.getById)(params.id);
    if (!user) throw ERRORS.USER_NOT_FOUND;
    return FormattedResponse.send({
      message: 'User fetched successfully!',
      data: user,
    });
  }

  @Patch(':id')
  async updateUserById(@Param() params: UUIDSchema, @Body() payload: UpdateUserSchema) {
    const user = await traced[layer](this.service.updateById)(params.id, payload);
    if (!user) throw ERRORS.USER_NOT_FOUND;
    return FormattedResponse.send({
      message: 'User updated successfully!',
      data: user,
    });
  }

  @Delete(':id')
  async deleteUserById(@Param() params: UUIDSchema) {
    const result = await traced[layer](this.service.deleteById)(params.id);
    if (!result.affected) throw ERRORS.USER_NOT_FOUND;
    return FormattedResponse.send({ message: 'User deleted successfully!' });
  }
}
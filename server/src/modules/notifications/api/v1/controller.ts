import { Request } from 'express';
import { FormattedResponse, Protect } from '@/middleware';
import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterSchema } from './schema';
import { NotificationService } from './service';

@ApiTags('Notifications')
@Controller({ path: 'notifications', version: '1' })
@UseGuards(Protect)
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post('register')
  @HttpCode(200)
  async registerToken(@Req() req: Request, @Body() body: RegisterSchema) {
    await this.service.registerToken(req.user!, body.token);
    return FormattedResponse.send({
      message: 'Registered for notifications successfully!'
    });
  }
}

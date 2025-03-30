import { Request, Response } from 'express';
import { FormattedResponse, Protect } from '@/middleware';
import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cookies } from '../../utils';
import { LoginSchema } from './schema';
import { AuthService } from './service';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async create(@Res({ passthrough: true }) res: Response, @Body() payload: LoginSchema) {
    const { user, access_token, refresh_token } = await this.service.login(payload);
    Cookies.setTokens(res, access_token, refresh_token);
    return FormattedResponse.send({
      message: 'Login successfull!',
      data: user
    });
  }

  @Get('current')
  @UseGuards(Protect)
  current(@Req() req: Request) {
    return FormattedResponse.send({ data: req.user, message: 'Auth user fetched successfully!' });
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(Protect)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.service.logout(req.cookies.access_token);
    Cookies.clearTokens(res);
    return FormattedResponse.send({ message: 'Logged out successfully!' });
  }
}

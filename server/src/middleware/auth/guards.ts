import { Request, Response } from 'express';
import { default as context } from 'express-http-context';
import { ctxAuthorizerError, headers, UserRole } from '@shared/constants';
import { Observable } from 'rxjs';
import { ERRORS } from '@/modules/auth/constants';
import { Cookies } from '@/modules/auth/utils';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class Protect implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = ctx.switchToHttp().getRequest();
    const response: Response = ctx.switchToHttp().getResponse();
    if (
      process.env.SERVICE_REQUEST_KEY &&
      request.headers[headers.serviceRequestKey] === process.env.SERVICE_REQUEST_KEY
    ) {
      return true;
    }
    const authorizerErr = context.get(ctxAuthorizerError);
    if (authorizerErr) {
      Cookies.clearTokens(response);
      throw authorizerErr;
    }
    return true;
  }
}

@Injectable()
export class AdminProtect implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = ctx.switchToHttp().getRequest();
    if (
      process.env.SERVICE_REQUEST_KEY &&
      request.headers[headers.serviceRequestKey] === process.env.SERVICE_REQUEST_KEY
    ) {
      return true;
    }
    const user = request.user as IUser;
    if (user.role !== UserRole.Administrator) {
      throw ERRORS.FORBIDDEN_ROUTE;
    }
    return true;
  }
}

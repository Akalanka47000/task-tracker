import { NextFunction, Request, Response } from 'express';
import { default as context } from 'express-http-context';
import { ctxAuthorizerError, ctxHeaders, ctxUser, headers, UserRole } from '@shared/constants';
import { Observable } from 'rxjs';
import { ERRORS } from '@/modules/auth/constants';
import { Blacklist, Cookies, JWT } from '@/modules/auth/utils';
import { UserService } from '@/modules/users/api/v1/service';
import { CanActivate, ExecutionContext, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class Sentinel implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (process.env.SERVICE_REQUEST_KEY && req.headers[headers.serviceRequestKey] === process.env.SERVICE_REQUEST_KEY)
      return next();

    const token = req.cookies?.access_token;

    if (!token) {
      context.set(ctxAuthorizerError, ERRORS.MISSING_TOKEN);
      return next();
    }

    let decodedUser: IUser;

    try {
      decodedUser = JWT.verify(token);
    } catch (e) {
      if (e.message === 'jwt expired') {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) {
          context.set(ctxAuthorizerError, e);
          return next();
        }
        try {
          decodedUser = JWT.verify(refreshToken);
          const tokens = JWT.generate(decodedUser);
          Cookies.setTokens(res, tokens.access_token, tokens.refresh_token);
        } catch (e) {
          context.set(ctxAuthorizerError, e);
          return next();
        }
      }
      context.set(ctxAuthorizerError, e);
      return next();
    }

    const user = await this.userService.getById(decodedUser.id);

    if (!user) {
      context.set(ctxAuthorizerError, ERRORS.INVALID_TOKEN);
      return next();
    }
    if (await Blacklist.has(token)) {
      context.set(ctxAuthorizerError, ERRORS.CANCELLED_TOKEN);
      return next();
    }

    req.user = user;
    req.headers[headers.userId] = user?.id;
    req.headers[headers.userUsername] = user?.username;

    context.set(ctxUser, user);
    context.set(ctxHeaders, req.headers);

    next();
  }
}

@Injectable()
export class Protect implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const response = ctx.switchToHttp().getResponse();
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
    const request = ctx.switchToHttp().getRequest();
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

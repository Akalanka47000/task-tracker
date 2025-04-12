import { default as typeormFilterQuery } from '@sliit-foss/typeorm-filter-query';
import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class FilterQuery implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    typeormFilterQuery(req, undefined, () => {});
    return next.handle().pipe();
  }
}

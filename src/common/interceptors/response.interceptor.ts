import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const res = ctx.getResponse();
      const statusCode = res.statusCode;
      const message = this.getMessage(context);
  
      return next.handle().pipe(
        map((data) => {
          if (
            data &&
            typeof data === 'object' &&
            'statusCode' in data &&
            'message' in data
          ) {
            return data;
          }
  
          const payload: any = { statusCode, message };
          if (data !== undefined) payload.data = data;
          return payload;
        }),
      );
    }
  
    private getMessage(context: ExecutionContext): string {
      const req = context.switchToHttp().getRequest();
      switch (req.method) {
        case 'POST':  return 'Resource created successfully';
        case 'GET':   return 'Request successful';
        case 'PATCH': return 'Resource updated successfully';
        case 'DELETE':return 'Resource deleted successfully';
        default:      return 'Request successful';
      }
    }
  }
  
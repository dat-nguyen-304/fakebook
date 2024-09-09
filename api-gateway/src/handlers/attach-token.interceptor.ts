import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class AttachTokensInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    return next.handle().pipe(
      tap(data => {
        const { accessToken, refreshToken } = data;

        if (accessToken && refreshToken) {
          // Set accessToken in cookies
          response.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: 'strict'
          });

          // Set refreshToken in cookies
          response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict'
          });
        }
      })
    );
  }
}

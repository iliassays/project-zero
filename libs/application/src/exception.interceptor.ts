import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestContextService } from './application.request.context';
import { ApiErrorResponse } from '@libs/api/api-error.response';
import { ExceptionBase } from 'libs/exceptions';

export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(ExceptionInterceptor.name);

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ExceptionBase> {
    return next.handle().pipe(
      catchError((err) => {
        if (err.status >= 400 && err.status < 500) {
          this.logger.debug(
            `[${RequestContextService.getRequestId()}] ${err.message}`,
          );

          const isClassValidatorError =
            Array.isArray(err?.response?.message) &&
            typeof err?.response?.error === 'string' &&
            err.status === 400;
          if (isClassValidatorError) {
            err = new BadRequestException(
              new ApiErrorResponse({
                statusCode: err.status,
                message: 'Validation error',
                error: err?.response?.error,
                subErrors: err?.response?.message,
                correlationId: RequestContextService.getRequestId(),
              }),
            );
          }
        }

        if (!err.correlationId) {
          err.correlationId = RequestContextService.getRequestId();
        }

        if (err.response) {
          err.response.correlationId = err.correlationId;
        }

        return throwError(err);
      }),
    );
  }
}

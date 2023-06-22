import { ExceptionBase } from 'libs/exceptions';

export class SignalServiceError extends ExceptionBase {
  static readonly message = 'SignalServiceError';

  public readonly code = '422';

  constructor(cause?: Error, metadata?: unknown) {
    super(SignalServiceError.message, cause, metadata);
  }
}

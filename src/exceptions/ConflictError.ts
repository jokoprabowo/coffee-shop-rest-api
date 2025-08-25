import { ClientError } from './ClientError';

export class ConflictError extends ClientError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

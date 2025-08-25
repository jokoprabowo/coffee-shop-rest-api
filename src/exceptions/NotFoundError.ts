import { ClientError } from './ClientError';

export class NotFoundError extends ClientError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

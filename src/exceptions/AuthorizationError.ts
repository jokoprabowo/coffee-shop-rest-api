import { ClientError } from "./ClientError";

export class AuthorizationError extends ClientError {

  constructor(message: string) {
    super(message, 403, "FORBIDDEN");
    this.name = 'AuthorizationError';
  }
}

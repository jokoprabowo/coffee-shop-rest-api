export class ClientError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string, statusCode: number = 400, status: string = 'BAD_REQUEST') {
    super(message);
    this.name = 'ClientError';
    this.statusCode = statusCode;
    this.status = status;
  }
}

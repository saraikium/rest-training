import { DatabaseError, ValidationError } from 'sequelize';

export default function errorHandler(error, req, resp, next) {
  let message;
  let statusCode;

  if (error instanceof DatabaseError) {
    message = error.errors || error.message || 'Internal Server Error';
    statusCode = error.statusCode || error.code || 500;
  } else if (error instanceof ValidationError) {
    message = error.errors || error.message || 'Bad request, invalid params.';
    statusCode = 400;
  } else {
    message = error.message;
    statusCode = 500;
  }
  resp.status(statusCode).json({ error: message });
}

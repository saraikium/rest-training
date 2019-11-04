import { DatabaseError, ValidationError } from 'sequelize';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import {
  NotFoundError,
  AuthenticationError,
  AuthorizationError
} from '../errors/ErrorClasses';

/* eslint-disable no-use-before-define */
export default {
  notFoundErrors,
  authorizationErrors,
  authenticationErrors,
  tokenErrors,
  dbErrors,
  serverErrors
};

function getErrorMessages(errors) {
  if (Array.isArray(errors)) return errors.map(error => error.message);
  return [errors];
}

function notFoundErrors(error, req, resp, next) {
  if (error instanceof NotFoundError) {
    const errors = getErrorMessages(error.message);
    return resp.status(404).json({ errors });
  }
  next();
}

function authenticationErrors(error, req, resp, next) {
  if (error instanceof AuthenticationError) {
    const errors = getErrorMessages(error.message);
    return resp.status(401).json({ errors });
  }
  next();
}

function authorizationErrors(error, req, resp, next) {
  if (error instanceof AuthorizationError) {
    const errors = getErrorMessages(error.message);
    return resp.status(403).json({ errors });
  }
  next();
}

function tokenErrors(error, req, resp, next) {
  let errors;
  if (
    error instanceof TokenExpiredError ||
    error instanceof JsonWebTokenError
  ) {
    errors = [error.message];
    return resp.status(401).json({ errors });
  }
  next();
}

function dbErrors(error, req, resp, next) {
  let errors;
  if (error instanceof DatabaseError || error instanceof ValidationError) {
    errors = error.errors || error.message;
    errors = getErrorMessages(errors);
    return resp.status(500).json({ errors });
  }
  if (error instanceof ValidationError) {
    errors = error.errors || error.message;
    errors = getErrorMessages(errors);
    return resp.status(400).json({ errors });
  }
  next();
}

function serverErrors(error, req, resp, next) {
  let errors = error.errors || error.message;
  errors = getErrorMessages(error.message);
  resp.status(500).json({ errors });
}

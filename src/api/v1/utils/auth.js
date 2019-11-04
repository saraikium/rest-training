import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';

/* eslint-disable no-use-before-define */
export default {
  newToken,
  verifyToken
};

function newToken(params) {
  return jwt.sign(params, JWT_SECRET, {
    expiresIn: 1800
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

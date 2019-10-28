import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../configs';

/* eslint-disable no-use-before-define */
export default {
  newToken,
  verifyToken
};

function newToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
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

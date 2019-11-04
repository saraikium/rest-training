import jwt from 'jsonwebtoken';
import config from '../../config';

/* eslint-disable no-use-before-define */
export default {
  newToken,
  newRefreshToken,
  verifyToken
};

const { JWT_SECRET } = config;

function newToken(params) {
  return jwt.sign(params, JWT_SECRET, {
    expiresIn: '1h'
  });
}

function newRefreshToken(params) {
  return jwt.sign(params, JWT_SECRET, {
    expiresIn: '7d'
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

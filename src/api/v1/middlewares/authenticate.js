import auth from '../utils/auth';
import { User } from '../../../db/models';

const { verifyToken } = auth;

export default async function authenticateUser(req, resp, next) {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith('Bearer ')) {
    next('Invalid token.');
  }
  const token = bearer.split(' ')[1];

  try {
    const payload = await verifyToken(token);
    const user = await User.findOne({
      where: { id: payload.id },
      attributes: { exclude: ['passwordHash'] }
    });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

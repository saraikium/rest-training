import auth from '../utils/auth';
import { User } from '../../../db/models';
import { AuthenticationError } from '../../../errors/ErrorClasses';

const { verifyToken } = auth;

export default async function authenticateUser(req, resp, next) {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith('Bearer ')) {
    throw new AuthenticationError('Invalid JWT.');
  }
  const token = bearer.split(' ')[1];
  const payload = await verifyToken(token);
  const user = await User.findOne({
    where: { id: payload.id },
    attributes: { exclude: ['passwordHash'] }
  });
  req.user = user;
  next();
}

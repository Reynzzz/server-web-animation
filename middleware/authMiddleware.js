import { verifyToken } from '../helpers/jwtHelper.js';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }

  try {
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized. User not found.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

export default authMiddleware;

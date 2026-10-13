import jwt from 'jsonwebtoken';
import sql from '../db/postgres.js';
import ApiError from '../utils/ApiError.js';

export const verifyJWT = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const headerToken = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : null;
    const token = req.cookies?.accessToken || headerToken;

    if (!token) throw new ApiError(401, 'Authentication required');

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
      throw new ApiError(401, 'Invalid or expired token');
    }

    const [user] = await sql`
      SELECT id, name, email, created_at
      FROM users
      WHERE id = ${decoded.id}
      LIMIT 1
    `;
    if (!user) throw new ApiError(401, 'Invalid or expired token');
    req.user = user;
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sql from '../db/postgres.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
};

const passError = (error, next) => {
  if (error.code === '23505') return next(new ApiError(409, 'Email is already registered'));
  next(error instanceof ApiError ? error : new ApiError(500, error.message));
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      throw new ApiError(400, 'Name, email, and password are required');
    }
    if (password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

    const normalizedEmail = email.trim().toLowerCase();
    const [existingUser] = await sql`SELECT id FROM users WHERE email = ${normalizedEmail} LIMIT 1`;
    if (existingUser) throw new ApiError(409, 'Email is already registered');

    const password_hash = await bcrypt.hash(password, 10);
    const [user] = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name.trim()}, ${normalizedEmail}, ${password_hash})
      RETURNING id, name, email, created_at
    `;

    res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
  } catch (error) {
    passError(error, next);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) throw new ApiError(400, 'Email and password are required');

    const [user] = await sql`SELECT * FROM users WHERE email = ${email.trim().toLowerCase()} LIMIT 1`;
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '7d' }
    );
    const safeUser = { id: user.id, name: user.name, email: user.email, created_at: user.created_at };
    res.cookie('accessToken', accessToken, cookieOptions);
    res.status(200).json(new ApiResponse(200, { user: safeUser, accessToken }, 'Login successful'));
  } catch (error) {
    passError(error, next);
  }
};

export const logout = (req, res) => {
  res.clearCookie('accessToken', cookieOptions);
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
};

export const getCurrentUser = (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, 'User fetched successfully'));
};

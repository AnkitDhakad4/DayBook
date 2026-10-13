import 'dotenv/config';
import postgres from 'postgres';
import ApiError from '../utils/ApiError.js';

if (!process.env.DATABASE_URL) {
  throw new ApiError(500, 'DATABASE_URL is required');
}

const sql = postgres(process.env.DATABASE_URL, {
  ssl: process.env.DATABASE_SSL === 'true' ? 'require' : false
});

export default sql;

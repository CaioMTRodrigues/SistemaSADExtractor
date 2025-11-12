import 'dotenv/config';

export const PORT = process.env.PORT || '3000';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'local';
export const DATABASE_URL = process.env.DATABASE_URL || 'url';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || '...default_secret...';
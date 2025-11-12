import 'dotenv/config';

export const PORT = process.env.PORT || '3000';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://backend:backend123@localhost:5432/backend';
export const NODE_ENV = process.env.NODE_ENV || 'development';
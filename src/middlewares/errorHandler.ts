import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('💥 Central Error Logged:', err.message);

  // Database unique constraint error (Email already exists)
  if (err.code === '23505') {
    return res.status(400).json({ error: 'Email already exists!' });
  }

  // Default Fallback Server Error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
};
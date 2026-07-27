import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err) => {
          return {
            field: err.path[1] || err.path[0] || "unknown",
            message: err.message,
          };
        });
        res.status(400).json({
          success: false,
          errors: errorMessages,
        });
        return;
      }
      next(error);
    }
  };
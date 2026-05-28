import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Yeh line req.body ko check karegi hamare rules ke mutabik
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Agar sab sahi raha, toh agle controller par bhej do
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Agar Zod ne koi error pakda, toh asaan bhasha mein client ko list return karo
        const errorMessages = error.errors.map((err) => ({
          field: err.path[1], // Batayega ki kaunse field mein galti hai (e.g., email)
          message: err.message, // Batayega kya galti hai
        }));

        res.status(400).json({
          success: false,
          errors: errorMessages,
        });
        return;
      }
      next(error);
    }
  };
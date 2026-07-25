import { z } from 'zod';


export const createStudentSchema = z.object({
  body: z.object({
    name: z.string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters long"),

    email: z.string()
      .min(1, "Email is required")
      .email("Invalid email format"),
    age: z.number()
      .min(15, "Age must be at least 15")
      .max(100, "Age cannot exceed 100"),

    phone: z.string().optional(),

    courses: z.array(
      z.object({
        title: z.string().min(3, "Course title must be at least 3 characters"),
        description: z.string().optional(),
        credits: z.number().min(1, "Credits must be at least 1"),
      })
    ).min(1, "At least one course must be provided"),
  }),
});

export const getStudentsQuerySchema = z.object({
  
  query: z.object({
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.enum(['name', 'age', 'enrolled_at']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
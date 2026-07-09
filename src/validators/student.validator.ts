import { z } from 'zod';

export const createStudentSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }).min(2, "Name must be at least 2 characters long"),

    email: z.string({
      required_error: "Email is required",
    }).email("Invalid email format"),

    age: z.number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a number",
    }).min(15, "Age must be at least 15").max(100, "Age cannot exceed 100"),

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
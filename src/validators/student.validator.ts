import { z } from 'zod';

export const createStudentSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),

    email: z.string().email("Invalid email format"),

    age: z.number({
      errorMap: (issue, ctx) => {
        if (issue.code === 'invalid_type') return { message: "Age must be a number" };
        if (issue.code === 'too_small') return { message: "Age must be at least 15" };
        if (issue.code === 'too_big') return { message: "Age cannot exceed 100" };
        return { message: ctx.defaultError };
      }
    }).min(15).max(100),

    phone: z.string().optional(),

    courses: z.array(
      z.object({
        title: z.string().min(3, "Course title must be at least 3 characters"),
        description: z.string().optional(),
        credits: z.number().min(1, "Credits must be at least 1"),
      })
    ).min(1, "At least one course must be provided")
  })
});
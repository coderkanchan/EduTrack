import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';


// 1. CREATE NEW STUDENT WITH COURSES
export const createStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, age, phone, courses } = req.body;

    // Prisma transactional write karega: Student aur uske Courses ek sath save honge
    const newStudent = await prisma.student.create({
      data: {
        name,
        email,
        age: Number(age),
        phone,
        // Yahan hum relation 'connect' ya 'create' karte hain
        courses: {
          create: courses // Agar req.body mein courses ka array aayega toh auto-insert ho jayega
        }
      },
      include: {
        courses: true // Response mein naye student ke sath uske courses bhi dikhenge
      }
    });

    res.status(201).json({
      success: true,
      message: "Student and enrolled courses created successfully!",
      data: newStudent
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET ALL STUDENTS WITH THEIR COURSES
export const getAllStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const students = await prisma.student.findMany({
      include: {
        courses: true // Yeh line har student ke data ke andar uske courses ka array jod degi!
      },
      orderBy: {
        id: 'asc'
      }
    });

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// 3. Update Student Data (UPDATE)
export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, age, phone } = req.body;

    const updatedStudent = await prisma.student.update({
      where: { id: Number(id) },
      data: {
        name: name ?? undefined,
        email: email ?? undefined,
        age: age ? Number(age) : undefined,
        phone: phone ?? undefined
      }
    });

    res.json(updatedStudent);
  } catch (err) {
    next(err);
  }
};

// 4. Delete Student (DELETE)
export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.student.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Student deleted successfully via Prisma!' });
  } catch (err) {
    next(err);
  }
};
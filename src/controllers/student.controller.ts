import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';

export const createStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, age, phone, courses } = req.body;

    const newStudent = await prisma.student.create({
      data: {
        name,
        email,
        age: Number(age),
        phone,
        courses: {
          create: courses
        }
      },
      include: {
        courses: true
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

export const getAllStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const students = await prisma.student.findMany({
      include: {
        courses: true
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

export const deleteStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const studentExists = await prisma.student.findUnique({
      where: { id: Number(id) }
    });

    if (!studentExists) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }

    await prisma.student.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({
      success: true,
      message: "Student and all their associated courses deleted successfully!"
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentProfileWithStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
      include: {
        courses: true
      }
    });

    if (!student) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }

    const stats = await prisma.course.aggregate({
      where: { studentId: Number(id) },
      _sum: {
        credits: true
      },
      _count: {
        id: true
      }
    });

    res.status(200).json({
      success: true,
      data: {
        profile: student,
        totalCourses: stats._count.id,
        totalCredits: stats._sum.credits || 0
      }
    });
  } catch (error) {
    next(error);
  }
};
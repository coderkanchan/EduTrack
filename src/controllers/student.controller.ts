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

// 2. GET ALL STUDENTS (WITH SEARCH, PAGINATION & SORTING)
export const getStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Query params se values nikalenge
    const { search, page = '1', limit = '10', sortBy = 'enrolled_at', sortOrder = 'desc' } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum; 

    const whereCondition = search
      ? {
        OR: [
          { name: { contains: String(search), mode: 'insensitive' as const } }, 
          { email: { contains: String(search), mode: 'insensitive' as const } },
        ],
      }
      : {};

    const [students, totalCount] = await Promise.all([
      prisma.student.findMany({
        where: whereCondition,
        include: { courses: true },
        skip: skip, 
        take: limitNum, 
        orderBy: {
          [String(sortBy)]: sortOrder,
        },
      }),
      prisma.student.count({ where: whereCondition }), 
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      meta: {
        totalRecords: totalCount,
        currentPage: pageNum,
        totalPages: totalPages,
        limit: limitNum,
      },
      data: students,
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
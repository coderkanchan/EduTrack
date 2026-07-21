import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';

export const createStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, age, phone, courses } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const newStudent = await tx.student.create({
        data: {
          name,
          email,
          age,
          phone,
        },
      });

      let createdCourses = [];
      if (courses && courses.length > 0) {
        const coursePromises = courses.map((course: any) =>
          tx.course.create({
            data: {
              title: course.title,
              description: course.description,
              credits: course.credits,
              studentId: newStudent.id, 
            },
          })
        );
        createdCourses = await Promise.all(coursePromises);
      }
      return { student: newStudent, courses: createdCourses };
    });

    res.status(201).json({
      success: true,
      message: "Student and courses securely created within a safe transaction block!",
      data: result,
    });

  } catch (error) {
    next(error); 
  }
};

export const getAllStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    
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

    const validSortFields = ['name', 'age', 'enrolled_at'];

    const sortField = validSortFields.includes(String(sortBy)) ? String(sortBy) : 'enrolled_at';

    const [students, totalCount] = await Promise.all([
      prisma.student.findMany({
        where: whereCondition,
        include: { courses: true },
        skip: skip,
        take: limitNum,
        orderBy: {
          [sortField]: sortOrder as 'asc' | 'desc'
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
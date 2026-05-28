import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js'; 

// 1. Get All Students (READ)
export const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(students);
  } catch (err) {
    next(err);
  }
};

// 2. Create New Student (CREATE)
export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
      return res.status(400).json({ error: 'Please provide name, email, and age' });
    }

    const newStudent = await prisma.student.create({
      data: { name, email, age: Number(age) }
    });

    res.status(201).json(newStudent);
  } catch (err) {
    next(err);
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
import { Request, Response } from 'express';
import pool from '../config/db.js';
import { Student } from '../interfaces/student.js';

// 1. Get All Students
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Student>('SELECT * FROM students ORDER BY id ASC;');
    res.json(result.rows);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 2. Create New Student
export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
      return res.status(400).json({ error: 'Please provide name, email, and age' });
    }

    const queryText = `
            INSERT INTO students (name, email, age) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
    const values = [name, email, age];
    const result = await pool.query<Student>(queryText, values);

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error(err.message);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists!' });
    }
    res.status(500).send('Server Error');
  }
};
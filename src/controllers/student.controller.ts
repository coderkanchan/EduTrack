import { Request, Response, NextFunction } from 'express';
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

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
      return res.status(400).json({ error: 'Please provide name, email, and age' });
    }

    const queryText = `INSERT INTO students (name, email, age) VALUES ($1, $2, $3) RETURNING *;`;
    const result = await pool.query<Student>(queryText, [name, email, age]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err); // Yeh error ko seedha errorHandler.ts middleware ke paas bhej dega!
  }
};

// 3. Update Student Data (PUT)
export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, age, phone } = req.body;

    // SQL Query to update and return the new row
    const queryText = `
            UPDATE students 
            SET name = COALESCE($1, name), 
                email = COALESCE($2, email), 
                age = COALESCE($3, age),
                phone = COALESCE($4, phone)
            WHERE id = $5
            RETURNING *;
        `;
    const values = [name, email, age, phone, id];
    const result = await pool.query<Student>(queryText, values);

    // Check if student exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found!' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err); // Central error handler handles unique constraints
  }
};

// 4. Delete Student (DELETE)
export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const queryText = 'DELETE FROM students WHERE id = $1 RETURNING *;';
    const result = await pool.query<Student>(queryText, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found!' });
    }

    res.json({ message: 'Student deleted successfully!', deletedStudent: result.rows[0] });
  } catch (err) {
    next(err);
  }
};
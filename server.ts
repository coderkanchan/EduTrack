import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// PostgreSQL Connection Pool Configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});

// Test DB Connection
pool.connect((err) => {
    if (err) {
        return console.error('❌ Error connecting to PostgreSQL:', err.stack);
    }
    console.log('✅ PostgreSQL Database Connected Successfully via TypeScript!');
});

// Interface for Student Type Safety
interface Student {
    id: number;
    name: string;
    email: string;
    age: number;
    enrolled_at: Date;
    phone: string | null;
}

// API Endpoint to Get All Students
app.get('/api/students', async (req: Request, res: Response) => {
    try {
        // TypeScript types the rows matching our Student interface
        const result = await pool.query<Student>('SELECT * FROM students ORDER BY id ASC;');
        res.json(result.rows);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 TS Server running on port ${PORT}`);
});
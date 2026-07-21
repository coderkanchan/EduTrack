import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});

pool.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to PostgreSQL:', err.stack);
    } else {
        console.log('✅ PostgreSQL Database Connected Successfully!');
    }
});

export default pool;
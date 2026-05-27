import express from 'express';
import studentRoutes from './routes/student.routes.js';

const app = express();

app.use(express.json());

// Routes Mounting
app.use('/api/students', studentRoutes);

export default app;
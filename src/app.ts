import express from 'express';
import studentRoutes from './routes/student.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';


const app = express();

app.use(express.json());

app.use('/api/students', studentRoutes);

app.use(errorHandler);

export default app;
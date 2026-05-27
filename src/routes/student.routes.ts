import { Router } from 'express';
import { getAllStudents, createStudent } from '../controllers/student.controller.js';

const router = Router();

router.get('/', getAllStudents);
router.post('/', createStudent);

export default router;
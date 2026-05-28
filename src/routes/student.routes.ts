import { Router } from 'express';
import { getAllStudents, createStudent, updateStudent, deleteStudent, getStudentProfileWithStats } from '../controllers/student.controller.js';

const router = Router();

router.get('/', getAllStudents);
router.post('/', createStudent);

router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

router.get('/:id/stats', getStudentProfileWithStats);

export default router;
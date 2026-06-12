import { Router } from 'express';
import { getAllStudents, createStudent, updateStudent, deleteStudent, getStudentProfileWithStats } from '../controllers/student.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createStudentSchema } from '../validators/student.validator.js';

const router = Router();

router.post('/', validate(createStudentSchema), createStudent);

router.get('/', getAllStudents);
router.post('/', createStudent);

router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

router.get('/:id/stats', getStudentProfileWithStats);

export default router;
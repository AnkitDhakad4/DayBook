import { Router } from 'express';
import { createTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/task.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import subtaskRoutes from './subtask.routes.js';

const router = Router();
router.use(verifyJWT);
router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.use('/:taskId/subtasks', subtaskRoutes);

export default router;

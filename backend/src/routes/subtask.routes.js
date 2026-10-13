import { Router } from 'express';
import { createSubtask, deleteSubtask, updateSubtask } from '../controllers/subtask.controller.js';

const router = Router({ mergeParams: true });
router.post('/', createSubtask);
router.patch('/:subtaskId', updateSubtask);
router.delete('/:subtaskId', deleteSubtask);

export default router;

import { Router } from 'express';
import {
    createTask,
    getTaskById,
    getAllTasks,
    updateTask,
    deleteTask,
    updateTaskStatus,
    clearAllTasks
} from '../controllers/TaskController';

const router = Router();

router.route('/').get(getAllTasks).post(createTask);

router.route('/:id').get(getTaskById);

router.route('/:id').put(updateTask);

router.route('/:id').patch(updateTaskStatus);

router.route('/clear').delete(clearAllTasks);

router.route('/:id').put(updateTask).delete(deleteTask);



export default router;
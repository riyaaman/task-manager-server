import { Request, Response } from 'express';
import Task, { ITaskDocument } from '../models/Task';

export const createTask = async (req: Request, res: Response): Promise<void> => {

    try {
        const { title, description } = req.body;
        if (!title) {
            res.status(400).json({ message: 'Title is required' });
            return;
        }

        const newTask: ITaskDocument = await Task.create({
            title,
            description: description || '',
            isCompleted: false,
        });

        const taskResponse = {
            id: newTask._id,
            title: newTask.title,
            description: newTask.description,
            isCompleted: newTask.isCompleted
        }

        res.status(201).json({ message: 'Task created successfully', data: { task: taskResponse } });

    } catch (error) {
        res.status(500).json({ Message: 'Server Error', error });

    }

}


export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await Task.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    title: 1,
                    description: 1,
                    isCompleted: 1,
                }
            }
        ]);
        res.status(200).json({ message: "Success", data: { tasks } });
    } catch (error) {
        res.status(500).json({ Message: 'Server Error', error });
    }

}


export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const taskId: string = req.params.id;
        const task: ITaskDocument | null = await Task.findById(taskId);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ Message: 'Server Error', error });
    }
}



export const updateTask = async (req: Request, res: Response): Promise<void> => {

    try {
        const taskId: string = req.params.id;
        const { title, description, isCompleted } = req.body;
        const updatedTask: ITaskDocument | null = await Task.findByIdAndUpdate({
            _id: taskId
        }, {
            title,
            description,
            isCompleted
        }, {
            new: true
        })

        if (!updatedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json(updatedTask);

    } catch (error) {
        res.status(500).json({ Message: 'Server Error', error });
    }

}



export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const taskId: string = req.params.id;
        const deletedTask: ITaskDocument | null = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ Message: 'Server Error', error });
    }
}

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {

    try {
        const taskId: string = req.params.id;
        const { isCompleted } = req.body;
        const updatedTask: ITaskDocument | null = await Task.findByIdAndUpdate(taskId, { isCompleted });

        if (!updatedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json({
            message: 'Task status updated successfully', data: {
                task: {
                    id: updatedTask._id,
                    title: updatedTask.title,
                    description: updatedTask.description,
                    isCompleted: updatedTask.isCompleted
                }
            }
        });
    } catch (error) {
        res.status(500).json({ Message: 'Server Error', error });
    }
}


export const clearAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        await Task.deleteMany({});
        res.status(200).json({ message: 'All tasks deleted successfully' });
    } catch (error) {
        res.status(500).json({ Message: 'Server Error', error });
    }
}
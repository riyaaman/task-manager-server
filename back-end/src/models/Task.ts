
import mongoose, { Document, Schema } from 'mongoose';

//  Interface for the raw document data
export interface ITask {
    title: string;
    description: string;
    isCompleted: boolean;
}

//  Interface for the Mongoose document (includes Mongoose properties like ._id)
export interface ITaskDocument extends ITask, Document {
    createdAt: Date;
    updatedAt: Date;
}

//  Define the Schema
const TaskSchema: Schema = new Schema<ITaskDocument>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

//  Export the Model
const Task = mongoose.model<ITaskDocument>('Task', TaskSchema);
export default Task;
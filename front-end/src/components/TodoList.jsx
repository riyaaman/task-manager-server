// src/components/TodoList.jsx

import React from "react";
import { useTasks } from "../hooks/useTasks"; 
import { getVisibleTasks } from '../utils/taskSelectors'; // From Day 16
import EditableTask from "./EditableTask"; // <-- The component with the design

function TodoList() {
    const { state } = useTasks();
    const { tasks, loading, error, filter, sortBy } = state; 
    
    // Get the tasks filtered and sorted based on state
    const visibleTasks = getVisibleTasks(tasks, filter, sortBy); 
    
    // Calculate completed count
    const completedCount = visibleTasks.filter(task => task && task.isCompleted).length;
    const hasTasks = visibleTasks && visibleTasks.length > 0;
    
    // UI Feedback for API status
    if (loading) return <p>⏳ Loading tasks...</p>;
    if (error) return <p className="error-message">⚠️ Error fetching tasks: {error}</p>;


    return (
        <div className="todo-list-display">
            <h2>Task List ({completedCount} Completed)</h2>

            {/* Empty State Feedback */}
            {!hasTasks && (
                <p className="empty-message">🎉 All done! No tasks remaining. 🎉</p>
            )}

            <ul className="task-list">
                {visibleTasks.map((task) => (
                    <li key={task.id} className="task-item">
                        {/* Render the specialized interactive component */}
                        <EditableTask task={task} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default React.memo(TodoList);
import { useTasks } from "../hooks/useTasks";
import { ActionType } from "../constants/taskReducerConstants";

function TaskControls() {
  const { state, dispatch } = useTasks();
  const { filter, sortBy } = state;

  return (
    <div className="task-controls">
      {/* Filter Dropdown */}
      <select
        value={filter}
        onChange={(e) =>
          dispatch({ type: ActionType.SET_FILTER, payload: e.target.value })
        }
      >
        <option value="ALL">All Tasks</option>
        <option value="ACTIVE">Active Tasks</option>
        <option value="COMPLETED">Completed Tasks</option>
      </select>

      {/* Sort Dropdown */}
      <select
        value={sortBy}
        onChange={(e) =>
          dispatch({ type: ActionType.SET_SORT, payload: e.target.value })
        }
      >
        <option value="DATE_DESC">Date Added (Newest)</option>
        <option value="DATE_ASC">Date Added (Oldest)</option>
        <option value="TITLE_ASC">Title (A-Z)</option>
        <option value="TITLE_DESC">Title (Z-A)</option>
      </select>
    </div>
  );
}

export default TaskControls;

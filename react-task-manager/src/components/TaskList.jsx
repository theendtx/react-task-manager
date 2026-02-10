import { memo } from "react";
import TaskItem from "./TaskItem";

const TaskList = memo(function TaskList({ tasks, onToggle, onRemove }) {
  if (!tasks || tasks.length === 0) {
    return <p className="empty">No tasks found</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
});

export default TaskList;

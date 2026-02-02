function TaskItem({ task, onToggle, onRemove }) {
  return (
    <li>
      <span
        className={`task-text ${
          task.completed ? "done" : ""
        }`}
        onClick={() => onToggle(task.id)}
      >
        {task.text}
      </span>

      <button
        className="delete-btn"
        onClick={() => onRemove(task.id)}
      >
        ❌
      </button>
    </li>
  );
}

export default TaskItem;

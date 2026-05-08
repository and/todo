import type { Task, Goal, LifeArea } from "../types";

interface Props {
  task: Task;
  goal?: Goal;
  lifeArea?: LifeArea;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, goal, lifeArea, onToggle, onDelete }: Props) {
  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <button
        className={`task-checkbox ${task.completed ? "checked" : ""}`}
        style={task.completed && lifeArea ? { background: lifeArea.color, borderColor: lifeArea.color } : {}}
        onClick={() => onToggle(task.id, !task.completed)}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed && "✓"}
      </button>

      <div className="task-body">
        <span className="task-title">{task.title}</span>

        <div className="task-meta">
          {lifeArea && (
            <span className="task-area-dot" style={{ color: lifeArea.color }}>
              {lifeArea.icon}
            </span>
          )}
          {goal && <span className="task-goal-link">↳ {goal.title}</span>}
          {task.recurring && (
            <span className="task-badge">{task.recurring === "daily" ? "🔁 daily" : "🔁 weekly"}</span>
          )}
        </div>

        <details className="task-why-detail">
          <summary>Why this matters</summary>
          <p>{task.why}</p>
        </details>
      </div>

      <button
        className="btn-icon danger task-delete"
        onClick={() => onDelete(task.id)}
        title="Delete task"
      >
        ✕
      </button>
    </div>
  );
}

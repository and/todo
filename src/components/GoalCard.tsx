import type { Goal, Task, LifeArea } from "../types";

interface Props {
  goal: Goal;
  tasks: Task[];
  lifeArea?: LifeArea;
  onAddTask: (goalId: string) => void;
  onBreakWithAI: (goalId: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function GoalCard({ goal, tasks, lifeArea, onAddTask, onBreakWithAI, onToggleComplete, onDelete }: Props) {
  const goalTasks = tasks.filter((t) => t.goalId === goal.id);
  const doneTasks = goalTasks.filter((t) => t.completed);
  const progress = goalTasks.length ? Math.round((doneTasks.length / goalTasks.length) * 100) : 0;

  return (
    <div className={`goal-card ${goal.completed ? "completed" : ""}`}>
      <div className="goal-card-header">
        <div className="goal-title-row">
          {lifeArea && (
            <span
              className="area-badge"
              style={{ background: lifeArea.color + "22", color: lifeArea.color }}
            >
              {lifeArea.icon} {lifeArea.name}
            </span>
          )}
          <h3 className="goal-title">{goal.title}</h3>
        </div>
        <div className="goal-actions">
          <button
            className="btn-icon"
            title={goal.completed ? "Mark incomplete" : "Mark complete"}
            onClick={() => onToggleComplete(goal.id, !goal.completed)}
          >
            {goal.completed ? "↩" : "✓"}
          </button>
          <button className="btn-icon danger" title="Delete goal" onClick={() => onDelete(goal.id)}>
            🗑
          </button>
        </div>
      </div>

      {goal.description && <p className="goal-desc">{goal.description}</p>}

      <blockquote className="goal-why">
        <span className="why-label">Why</span> {goal.why}
      </blockquote>

      {goal.targetDate && (
        <p className="goal-target">
          🎯 Target: {new Date(goal.targetDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      )}

      {goalTasks.length > 0 && (
        <div className="goal-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%`, background: lifeArea?.color ?? "#6366f1" }}
            />
          </div>
          <span className="progress-label">{doneTasks.length}/{goalTasks.length} tasks done</span>
        </div>
      )}

      <div className="goal-card-actions">
        <button
          className="btn btn-sm btn-outline"
          onClick={() => onAddTask(goal.id)}
        >
          + Add task
        </button>
        <button
          className="btn btn-sm btn-ai"
          onClick={() => onBreakWithAI(goal.id)}
        >
          ✨ Break with AI
        </button>
      </div>
    </div>
  );
}

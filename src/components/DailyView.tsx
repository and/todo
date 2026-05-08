import type { Task, Goal, LifeArea } from "../types";
import TaskItem from "./TaskItem";

interface Props {
  tasks: Task[];
  goals: Goal[];
  lifeAreas: LifeArea[];
  selectedDate: string;
  onDateChange: (d: string) => void;
  onAddTask: () => void;
  onToggleTask: (id: string, completed: boolean) => void;
  onDeleteTask: (id: string) => void;
}

function fmt(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function DailyView({
  tasks,
  goals,
  lifeAreas,
  selectedDate,
  onDateChange,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const dayTasks = tasks.filter((t) => t.scheduledDate === selectedDate);
  const done = dayTasks.filter((t) => t.completed).length;
  const pct = dayTasks.length ? Math.round((done / dayTasks.length) * 100) : 0;

  return (
    <section className="daily-view">
      <div className="daily-header">
        <button className="btn-icon" onClick={() => onDateChange(offsetDate(selectedDate, -1))}>
          ‹
        </button>
        <div className="daily-title">
          <h2>{fmt(selectedDate)}</h2>
          {selectedDate !== today && (
            <button className="btn-link" onClick={() => onDateChange(today)}>
              back to today
            </button>
          )}
          {selectedDate === today && <span className="today-chip">Today</span>}
        </div>
        <button className="btn-icon" onClick={() => onDateChange(offsetDate(selectedDate, 1))}>
          ›
        </button>
      </div>

      {dayTasks.length > 0 && (
        <div className="daily-progress">
          <div className="progress-bar wide">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-label">{done}/{dayTasks.length} completed · {pct}%</span>
        </div>
      )}

      <div className="task-list">
        {dayTasks.length === 0 && (
          <div className="empty-state">
            <span>No tasks scheduled.</span>
            <button className="btn btn-sm btn-outline" onClick={onAddTask}>
              + Add one
            </button>
          </div>
        )}
        {dayTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            goal={task.goalId ? goals.find((g) => g.id === task.goalId) : undefined}
            lifeArea={lifeAreas.find((a) => a.id === task.lifeAreaId)}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      <button className="btn btn-primary add-task-btn" onClick={onAddTask}>
        + Add task
      </button>
    </section>
  );
}

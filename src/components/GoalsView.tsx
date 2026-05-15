import { useState } from "react";
import type { Goal, Task, LifeArea } from "../types";
import GoalCard from "./GoalCard";

interface Props {
  goals: Goal[];
  tasks: Task[];
  lifeAreas: LifeArea[];
  onAddGoal: () => void;
  onAddTask: (goalId: string) => void;
  onBreakWithAI: (goalId: string) => void;
  onToggleGoal: (id: string, completed: boolean) => void;
  onDeleteGoal: (id: string) => void;
}

export default function GoalsView({
  goals,
  tasks,
  lifeAreas,
  onAddGoal,
  onAddTask,
  onBreakWithAI,
  onToggleGoal,
  onDeleteGoal,
}: Props) {
  const [filter, setFilter] = useState<"active" | "completed">("active");

  const filtered = goals.filter((g) => (filter === "active" ? !g.completed : g.completed));

  return (
    <section className="goals-view">
      <div className="goals-header">
        <h2>Long-term Goals</h2>
        <div className="goals-toolbar">
          <div className="tab-group">
            <button
              className={`tab ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active ({goals.filter((g) => !g.completed).length})
            </button>
            <button
              className={`tab ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Done ({goals.filter((g) => g.completed).length})
            </button>
          </div>
          <button className="btn btn-primary" onClick={onAddGoal}>
            + New goal
          </button>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state large">
          {filter === "active" ? (
            <>
              <span className="empty-icon">🎯</span>
              <p>No active goals yet. Set a long-term goal to get started.</p>
              <button className="btn btn-primary" onClick={onAddGoal}>
                Create your first goal
              </button>
            </>
          ) : (
            <>
              <span className="empty-icon">🏆</span>
              <p>No completed goals yet. Keep going!</p>
            </>
          )}
        </div>
      )}

      <div className="goals-grid">
        {filtered.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            tasks={tasks}
            lifeArea={lifeAreas.find((a) => a.id === goal.lifeAreaId)}
            onAddTask={onAddTask}
            onBreakWithAI={onBreakWithAI}
            onToggleComplete={onToggleGoal}
            onDelete={onDeleteGoal}
          />
        ))}
      </div>
    </section>
  );
}

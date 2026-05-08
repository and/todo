import { useState } from "react";
import type { Goal, LifeArea, Task } from "../types";

interface Props {
  lifeAreas: LifeArea[];
  goals: Goal[];
  preselectedGoalId?: string;
  defaultDate: string;
  onSave: (task: Task) => void;
  onClose: () => void;
}

export default function AddTaskModal({
  lifeAreas,
  goals,
  preselectedGoalId,
  defaultDate,
  onSave,
  onClose,
}: Props) {
  const [title, setTitle] = useState("");
  const [goalId, setGoalId] = useState(preselectedGoalId ?? "none");
  const [lifeAreaId, setLifeAreaId] = useState(() => {
    if (preselectedGoalId) {
      return goals.find((g) => g.id === preselectedGoalId)?.lifeAreaId ?? lifeAreas[0]?.id ?? "";
    }
    return lifeAreas[0]?.id ?? "";
  });
  const [why, setWhy] = useState("");
  const [scheduledDate, setScheduledDate] = useState(defaultDate);
  const [recurring, setRecurring] = useState<"" | "daily" | "weekly">("");

  // When goal selection changes, auto-fill the life area
  function handleGoalChange(gid: string) {
    setGoalId(gid);
    if (gid !== "none") {
      const goal = goals.find((g) => g.id === gid);
      if (goal) {
        setLifeAreaId(goal.lifeAreaId);
        if (!why) setWhy(goal.why);
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !why.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      title: title.trim(),
      goalId: goalId !== "none" ? goalId : undefined,
      lifeAreaId,
      why: why.trim(),
      scheduledDate,
      completed: false,
      createdAt: new Date().toISOString(),
      recurring: recurring || undefined,
    });
  }

  const selectedArea = lifeAreas.find((a) => a.id === lifeAreaId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Task</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Task title *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Run 5km before breakfast"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Scheduled date *</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Repeat</label>
              <select value={recurring} onChange={(e) => setRecurring(e.target.value as "" | "daily" | "weekly")}>
                <option value="">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Linked goal (optional)</label>
            <select value={goalId} onChange={(e) => handleGoalChange(e.target.value)}>
              <option value="none">— No goal —</option>
              {goals.filter((g) => !g.completed).map((g) => {
                const area = lifeAreas.find((a) => a.id === g.lifeAreaId);
                return (
                  <option key={g.id} value={g.id}>
                    {area?.icon} {g.title}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label>Life area *</label>
            <div className="life-area-grid">
              {lifeAreas.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  className={`life-area-chip ${lifeAreaId === area.id ? "selected" : ""}`}
                  style={
                    lifeAreaId === area.id
                      ? { borderColor: area.color, background: area.color + "22", color: area.color }
                      : {}
                  }
                  onClick={() => setLifeAreaId(area.id)}
                >
                  {area.icon} {area.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group why-group">
            <label>
              <span className="why-icon">🤔</span> Why does this task matter? *
            </label>
            {selectedArea && (
              <p className="why-hint">
                How does completing this move you forward in <strong>{selectedArea.name}</strong>?
              </p>
            )}
            <textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="What specifically will this task improve or build toward?"
              rows={2}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim() || !why.trim()}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

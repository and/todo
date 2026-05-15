import { useState } from "react";
import type { Goal, LifeArea, Task } from "../types";
import type { SuggestedTask } from "../aiService";
import { breakGoalIntoTasks } from "../aiService";

interface Props {
  goal: Goal;
  lifeArea: LifeArea | undefined;
  apiKey: string;
  defaultDate: string;
  onSaveTasks: (tasks: Task[]) => void;
  onClose: () => void;
  onNeedApiKey: () => void;
}

export default function TaskBreakdownModal({
  goal,
  lifeArea,
  apiKey,
  defaultDate,
  onSaveTasks,
  onClose,
  onNeedApiKey,
}: Props) {
  const [suggestions, setSuggestions] = useState<SuggestedTask[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edited, setEdited] = useState<Record<number, Partial<SuggestedTask>>>({});

  async function generate() {
    if (!apiKey) {
      onNeedApiKey();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await breakGoalIntoTasks(apiKey, goal, lifeArea);
      setSuggestions(results);
      setSelected(new Set(results.map((_, i) => i)));
      setEdited({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function getTask(i: number): SuggestedTask {
    return { ...suggestions[i], ...edited[i] };
  }

  function toggleSelect(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function handleEdit(i: number, field: keyof SuggestedTask, value: string) {
    setEdited((prev) => ({ ...prev, [i]: { ...prev[i], [field]: value } }));
  }

  function handleAdd() {
    const tasks: Task[] = [...selected].map((i) => {
      const s = getTask(i);
      return {
        id: crypto.randomUUID(),
        title: s.title,
        goalId: goal.id,
        lifeAreaId: goal.lifeAreaId,
        why: s.why,
        scheduledDate: defaultDate,
        completed: false,
        createdAt: new Date().toISOString(),
        recurring: s.recurring || undefined,
      };
    });
    onSaveTasks(tasks);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✨ AI Task Breakdown</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="modal-form">
          <div className="breakdown-goal-preview">
            {lifeArea && (
              <span className="area-badge" style={{ background: lifeArea.color + "22", color: lifeArea.color }}>
                {lifeArea.icon} {lifeArea.name}
              </span>
            )}
            <strong>{goal.title}</strong>
          </div>

          {suggestions.length === 0 && !loading && (
            <div className="breakdown-empty">
              <p className="form-hint">
                Claude will suggest concrete tasks to help you achieve this goal. You can edit or deselect any suggestion before adding them.
              </p>
              {error && <p className="error-msg">{error}</p>}
              <button className="btn btn-primary" onClick={generate} disabled={loading}>
                ✨ Generate Task Ideas
              </button>
            </div>
          )}

          {loading && (
            <div className="breakdown-loading">
              <div className="spinner" />
              <p>Claude is thinking...</p>
            </div>
          )}

          {suggestions.length > 0 && !loading && (
            <>
              <div className="breakdown-list">
                {suggestions.map((_, i) => {
                  const t = getTask(i);
                  const isSelected = selected.has(i);
                  return (
                    <div key={i} className={`breakdown-item ${isSelected ? "selected" : "deselected"}`}>
                      <button
                        type="button"
                        className={`breakdown-check ${isSelected ? "checked" : ""}`}
                        onClick={() => toggleSelect(i)}
                        aria-label={isSelected ? "Deselect" : "Select"}
                      >
                        {isSelected ? "✓" : ""}
                      </button>
                      <div className="breakdown-fields">
                        <input
                          className="breakdown-title-input"
                          value={t.title}
                          onChange={(e) => handleEdit(i, "title", e.target.value)}
                        />
                        <input
                          className="breakdown-why-input"
                          value={t.why}
                          onChange={(e) => handleEdit(i, "why", e.target.value)}
                        />
                        <select
                          className="breakdown-recur-select"
                          value={t.recurring}
                          onChange={(e) => handleEdit(i, "recurring", e.target.value)}
                        >
                          <option value="">One-time</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="breakdown-footer">
                <button className="btn btn-ghost btn-sm" onClick={generate}>
                  ↺ Regenerate
                </button>
                <div className="modal-actions" style={{ marginTop: 0 }}>
                  <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAdd}
                    disabled={selected.size === 0}
                  >
                    Add {selected.size} task{selected.size !== 1 ? "s" : ""}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

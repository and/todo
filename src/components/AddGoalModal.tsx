import { useState } from "react";
import type { Goal, LifeArea } from "../types";

interface Props {
  lifeAreas: LifeArea[];
  onSave: (goal: Goal) => void;
  onClose: () => void;
}

export default function AddGoalModal({ lifeAreas, onSave, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lifeAreaId, setLifeAreaId] = useState(lifeAreas[0]?.id ?? "");
  const [why, setWhy] = useState("");
  const [targetDate, setTargetDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !why.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      lifeAreaId,
      why: why.trim(),
      targetDate: targetDate || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    });
  }

  const selectedArea = lifeAreas.find((a) => a.id === lifeAreaId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Long-Term Goal</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Goal title *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Run a marathon"
              required
            />
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any extra context or notes..."
              rows={2}
            />
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
              <span className="why-icon">🤔</span> Why is this important to you? *
            </label>
            {selectedArea && (
              <p className="why-hint">
                How does this goal improve your <strong>{selectedArea.name}</strong>?
              </p>
            )}
            <textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Be honest with yourself — what will change in your life if you achieve this?"
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label>Target date (optional)</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim() || !why.trim()}>
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

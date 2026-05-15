import { useState } from "react";

interface Props {
  onSave: (key: string) => void;
  onClose: () => void;
}

export default function ApiKeyModal({ onSave, onClose }: Props) {
  const [key, setKey] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (key.trim()) onSave(key.trim());
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Anthropic API Key</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <p className="form-hint">
            Your key is stored only in your browser's localStorage and never sent anywhere except directly to Anthropic's API.
          </p>
          <div className="form-group">
            <label>API Key *</label>
            <input
              autoFocus
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-ant-..."
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!key.trim()}>
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useStore } from "./store";
import type { ModalType } from "./types";
import DailyView from "./components/DailyView";
import GoalsView from "./components/GoalsView";
import AddGoalModal from "./components/AddGoalModal";
import AddTaskModal from "./components/AddTaskModal";
import ApiKeyModal from "./components/ApiKeyModal";
import TaskBreakdownModal from "./components/TaskBreakdownModal";
import "./App.css";

const API_KEY_STORAGE = "intentional_anthropic_key";

type Tab = "today" | "goals";

function App() {
  const store = useStore();
  const [tab, setTab] = useState<Tab>("today");
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) ?? "");

  function openAddTask(goalId?: string) {
    setModal({ kind: "add-task", goalId });
  }

  function openBreakWithAI(goalId: string) {
    if (!apiKey) {
      setModal({ kind: "api-key", returnTo: { kind: "break-goal", goalId } });
    } else {
      setModal({ kind: "break-goal", goalId });
    }
  }

  function handleSaveApiKey(key: string) {
    localStorage.setItem(API_KEY_STORAGE, key);
    setApiKey(key);
    const returnTo = modal?.kind === "api-key" ? modal.returnTo : null;
    setModal(returnTo);
  }

  const breakGoalId = modal?.kind === "break-goal" ? modal.goalId : null;
  const breakGoal = breakGoalId ? store.goals.find((g) => g.id === breakGoalId) : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="logo">🎯</span>
          <h1>Intentional</h1>
        </div>
        <nav className="app-nav">
          <button
            className={`nav-tab ${tab === "today" ? "active" : ""}`}
            onClick={() => setTab("today")}
          >
            Today
          </button>
          <button
            className={`nav-tab ${tab === "goals" ? "active" : ""}`}
            onClick={() => setTab("goals")}
          >
            Goals
          </button>
        </nav>
      </header>

      <main className="app-main">
        {tab === "today" && (
          <DailyView
            tasks={store.tasks}
            goals={store.goals}
            lifeAreas={store.lifeAreas}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onAddTask={() => openAddTask()}
            onToggleTask={(id, completed) => {
              store.updateTask(id, {
                completed,
                completedAt: completed ? new Date().toISOString() : undefined,
              });
            }}
            onDeleteTask={store.deleteTask}
          />
        )}

        {tab === "goals" && (
          <GoalsView
            goals={store.goals}
            tasks={store.tasks}
            lifeAreas={store.lifeAreas}
            onAddGoal={() => setModal({ kind: "add-goal" })}
            onAddTask={(goalId) => {
              openAddTask(goalId);
              setTab("today");
            }}
            onBreakWithAI={openBreakWithAI}
            onToggleGoal={(id, completed) => store.updateGoal(id, { completed })}
            onDeleteGoal={store.deleteGoal}
          />
        )}
      </main>

      {modal?.kind === "add-goal" && (
        <AddGoalModal
          lifeAreas={store.lifeAreas}
          onSave={(goal) => {
            store.addGoal(goal);
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.kind === "add-task" && (
        <AddTaskModal
          lifeAreas={store.lifeAreas}
          goals={store.goals}
          preselectedGoalId={modal.goalId}
          defaultDate={selectedDate}
          onSave={(task) => {
            store.addTask(task);
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.kind === "api-key" && (
        <ApiKeyModal
          onSave={handleSaveApiKey}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.kind === "break-goal" && breakGoal && (
        <TaskBreakdownModal
          goal={breakGoal}
          lifeArea={store.lifeAreas.find((a) => a.id === breakGoal.lifeAreaId)}
          apiKey={apiKey}
          defaultDate={selectedDate}
          onSaveTasks={(tasks) => {
            tasks.forEach((t) => store.addTask(t));
            setModal(null);
          }}
          onClose={() => setModal(null)}
          onNeedApiKey={() => setModal({ kind: "api-key", returnTo: modal })}
        />
      )}
    </div>
  );
}

export default App;

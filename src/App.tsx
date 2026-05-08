import { useState } from "react";
import { useStore } from "./store";
import type { ModalType } from "./types";
import DailyView from "./components/DailyView";
import GoalsView from "./components/GoalsView";
import AddGoalModal from "./components/AddGoalModal";
import AddTaskModal from "./components/AddTaskModal";
import "./App.css";

type Tab = "today" | "goals";

function App() {
  const store = useStore();
  const [tab, setTab] = useState<Tab>("today");
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  function openAddTask(goalId?: string) {
    setModal({ kind: "add-task", goalId });
  }

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
    </div>
  );
}

export default App;

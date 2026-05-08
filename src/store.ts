import { useState, useEffect, useCallback } from "react";
import type { Goal, Task, LifeArea } from "./types";

export const DEFAULT_LIFE_AREAS: LifeArea[] = [
  { id: "health", name: "Health & Fitness", color: "#22c55e", icon: "💪" },
  { id: "career", name: "Career & Work", color: "#3b82f6", icon: "💼" },
  { id: "relationships", name: "Relationships", color: "#ec4899", icon: "❤️" },
  { id: "finance", name: "Finance", color: "#f59e0b", icon: "💰" },
  { id: "learning", name: "Learning & Growth", color: "#8b5cf6", icon: "📚" },
  { id: "creativity", name: "Creativity", color: "#f97316", icon: "🎨" },
  { id: "mindfulness", name: "Mindfulness", color: "#06b6d4", icon: "🧘" },
];

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useStore() {
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>(() =>
    load("lifeAreas", DEFAULT_LIFE_AREAS)
  );
  const [goals, setGoals] = useState<Goal[]>(() => load("goals", []));
  const [tasks, setTasks] = useState<Task[]>(() => load("tasks", []));

  useEffect(() => { save("lifeAreas", lifeAreas); }, [lifeAreas]);
  useEffect(() => { save("goals", goals); }, [goals]);
  useEffect(() => { save("tasks", tasks); }, [tasks]);

  const addGoal = useCallback((goal: Goal) => {
    setGoals((prev) => [...prev, goal]);
  }, []);

  const updateGoal = useCallback((id: string, patch: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setTasks((prev) => prev.filter((t) => t.goalId !== id));
  }, []);

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addLifeArea = useCallback((area: LifeArea) => {
    setLifeAreas((prev) => [...prev, area]);
  }, []);

  return {
    lifeAreas,
    goals,
    tasks,
    addGoal,
    updateGoal,
    deleteGoal,
    addTask,
    updateTask,
    deleteTask,
    addLifeArea,
  };
}

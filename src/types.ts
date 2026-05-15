export type LifeAreaId =
  | "health"
  | "career"
  | "relationships"
  | "finance"
  | "learning"
  | "creativity"
  | "mindfulness"
  | "custom";

export interface LifeArea {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  lifeAreaId: string;
  why: string;
  createdAt: string;
  targetDate?: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  goalId?: string;       // optional — can be standalone
  lifeAreaId: string;
  why: string;
  scheduledDate: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  recurring?: "daily" | "weekly";
}

export type ModalType =
  | { kind: "add-goal" }
  | { kind: "add-task"; goalId?: string }
  | { kind: "goal-detail"; goalId: string }
  | { kind: "break-goal"; goalId: string }
  | { kind: "api-key"; returnTo: ModalType }
  | null;
